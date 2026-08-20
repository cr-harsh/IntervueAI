from abc import ABC, abstractmethod
import asyncio
import json
import time
from typing import Any, TypeVar

from fastapi import HTTPException
from groq import APIConnectionError, APIStatusError, APITimeoutError, AsyncGroq, RateLimitError
from pydantic import BaseModel, ValidationError

from app.core.config import Settings
from app.core.logger import logger
from app.prompts.answer_evaluation import SYSTEM_PROMPT as EVALUATION_SYSTEM_PROMPT, build_answer_evaluation_prompt
from app.prompts.question_generation import SYSTEM_PROMPT as QUESTION_SYSTEM_PROMPT, build_question_generation_prompt
from app.schemas.interview import (
    EvaluateAnswerRequest,
    EvaluationResponse,
    GenerateQuestionsRequest,
    GenerateQuestionsResponse,
    GeneratedQuestion,
)
from app.utils.schema_utils import flatten_json_schema

T = TypeVar('T', bound=BaseModel)


class LLMProvider(ABC):
    @abstractmethod
    async def generate_questions(self, request: GenerateQuestionsRequest) -> list[GeneratedQuestion]: ...

    @abstractmethod
    async def evaluate_answer(self, request: EvaluateAnswerRequest) -> EvaluationResponse: ...


class UnconfiguredLLMProvider(LLMProvider):
    async def generate_questions(self, request: GenerateQuestionsRequest) -> list[GeneratedQuestion]:
        logger.error('Attempted generate_questions with unconfigured GROQ_API_KEY or GROQ_MODEL')
        raise HTTPException(status_code=503, detail='Groq is not configured. Set GROQ_API_KEY and GROQ_MODEL.')

    async def evaluate_answer(self, request: EvaluateAnswerRequest) -> EvaluationResponse:
        logger.error('Attempted evaluate_answer with unconfigured GROQ_API_KEY or GROQ_MODEL')
        raise HTTPException(status_code=503, detail='Groq is not configured. Set GROQ_API_KEY and GROQ_MODEL.')


class GroqProvider(LLMProvider):
    def __init__(
        self,
        *,
        api_key: str,
        model: str,
        timeout_seconds: float = 30.0,
        structured_output: bool = True,
        client: Any | None = None,
    ):
        self.model = model
        self.structured_output = structured_output
        self.client = client or AsyncGroq(api_key=api_key, timeout=timeout_seconds, max_retries=0)

    async def generate_questions(self, request: GenerateQuestionsRequest) -> list[GeneratedQuestion]:
        def validate_question_count(resp: GenerateQuestionsResponse) -> None:
            if len(resp.questions) != request.questionCount:
                raise HTTPException(
                    status_code=502,
                    detail=f'Groq returned {len(resp.questions)} questions, expected {request.questionCount}.',
                )

        system_prompt = QUESTION_SYSTEM_PROMPT
        user_prompt = build_question_generation_prompt(
            resume=request.resume,
            job_description=request.jobDescription,
            domain=request.domain,
            experience_level=request.experienceLevel,
            difficulty=request.difficulty,
            question_count=request.questionCount,
        )
        logger.info('Sending question generation to Groq (model=%s, prompt_chars=%d, resume_chars=%d, jd_chars=%d)', self.model, len(user_prompt), len(request.resume), len(request.jobDescription))

        response = await self._complete_with_retry(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            schema=GenerateQuestionsResponse,
            schema_name='interview_questions',
            validator=validate_question_count,
        )
        return response.questions

    async def evaluate_answer(self, request: EvaluateAnswerRequest) -> EvaluationResponse:
        system_prompt = EVALUATION_SYSTEM_PROMPT
        user_prompt = build_answer_evaluation_prompt(
            question=request.question,
            answer=request.answer,
            resume=request.resume,
            job_description=request.jobDescription,
            domain=request.domain,
        )

        return await self._complete_with_retry(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            schema=EvaluationResponse,
            schema_name='answer_evaluation',
        )

    async def _complete_with_retry(
        self,
        system_prompt: str,
        user_prompt: str,
        schema: type[T],
        schema_name: str,
        validator: Any | None = None,
    ) -> T:
        max_attempts = 2
        last_error: Exception | None = None

        for attempt in range(1, max_attempts + 1):
            start_time = time.time()
            logger.info('Groq completion attempt %d/%d starting (model=%s, schema=%s)', attempt, max_attempts, self.model, schema_name)
            try:
                result = await self._single_completion(system_prompt, user_prompt, schema, schema_name)
                if validator:
                    validator(result)
                duration = time.time() - start_time
                logger.info('Groq completion attempt %d succeeded in %.2fs', attempt, duration)
                return result
            except HTTPException as exc:
                duration = time.time() - start_time
                logger.warning('Groq completion attempt %d failed in %.2fs with status %d: %s', attempt, duration, exc.status_code, exc.detail)
                # Non-retryable statuses: rate limits (429), client errors (400), auth (401/403/auth detail), service unconfigured (503)
                if exc.status_code in (400, 401, 403, 429, 503) or (exc.status_code == 502 and 'authentication' in str(exc.detail).lower()):
                    raise exc
                last_error = exc
            except Exception as exc:
                duration = time.time() - start_time
                logger.warning('Groq completion attempt %d failed in %.2fs with unexpected error: %s', attempt, duration, str(exc))
                last_error = exc

            if attempt < max_attempts:
                logger.info('Retrying Groq request (attempt %d)...', attempt + 1)
                await asyncio.sleep(0.5)

        if isinstance(last_error, HTTPException):
            raise last_error
        raise HTTPException(status_code=502, detail='Groq generation failed after retry')

    async def _single_completion(
        self,
        system_prompt: str,
        user_prompt: str,
        schema: type[T],
        schema_name: str,
    ) -> T:
        request_params: dict[str, Any] = {
            'model': self.model,
            'messages': [
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': user_prompt},
            ],
            'temperature': 0.2,
        }

        if self.structured_output:
            raw_schema = schema.model_json_schema()
            clean_schema = flatten_json_schema(raw_schema)
            request_params['response_format'] = {
                'type': 'json_schema',
                'json_schema': {
                    'name': schema_name,
                    'strict': True,
                    'schema': clean_schema,
                },
            }
        else:
            request_params['response_format'] = {'type': 'json_object'}

        try:
            completion = await self.client.chat.completions.create(**request_params)
            content = completion.choices[0].message.content if completion.choices else None
            if not content:
                raise HTTPException(status_code=502, detail='Groq returned an empty response')
            return schema.model_validate(json.loads(content))
        except HTTPException:
            raise
        except RateLimitError as error:
            retry_after = getattr(getattr(error, 'response', None), 'headers', {}).get('retry-after')
            headers = {'Retry-After': str(retry_after)} if retry_after else None
            raise HTTPException(status_code=429, detail='Groq rate limit exceeded. Retry later.', headers=headers) from error
        except (APITimeoutError, APIConnectionError) as error:
            raise HTTPException(status_code=503, detail='Groq service is temporarily unavailable or timed out.') from error
        except APIStatusError as error:
            status_code = getattr(error, 'status_code', 500)
            if status_code in (401, 403):
                raise HTTPException(status_code=502, detail='Groq authentication failure. Check GROQ_API_KEY.') from error
            raise HTTPException(status_code=502, detail=f'Groq API request failed with status {status_code}') from error
        except (json.JSONDecodeError, ValidationError) as error:
            raise HTTPException(status_code=502, detail=f'Groq returned malformed response schema: {str(error)}') from error



def create_llm_provider(settings: Settings) -> LLMProvider:
    if not settings.is_groq_configured or not settings.groq_model:
        return UnconfiguredLLMProvider()
    return GroqProvider(
        api_key=settings.groq_api_key,
        model=settings.groq_model,
        timeout_seconds=settings.groq_timeout_seconds,
        structured_output=settings.groq_structured_output,
    )

