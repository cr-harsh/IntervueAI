from abc import ABC, abstractmethod
from fastapi import HTTPException
from app.schemas.interview import EvaluationResponse, GenerateQuestionsRequest, GeneratedQuestion, EvaluateAnswerRequest


class LLMProvider(ABC):
    @abstractmethod
    async def generate_questions(self, request: GenerateQuestionsRequest) -> list[GeneratedQuestion]: ...

    @abstractmethod
    async def evaluate_answer(self, request: EvaluateAnswerRequest) -> EvaluationResponse: ...


class UnconfiguredLLMProvider(LLMProvider):
    """Safe default: the service never invents AI output when no provider is configured."""
    async def generate_questions(self, request: GenerateQuestionsRequest) -> list[GeneratedQuestion]:
        raise HTTPException(status_code=503, detail='LLM provider is not configured. Set LLM_PROVIDER and provider credentials.')

    async def evaluate_answer(self, request: EvaluateAnswerRequest) -> EvaluationResponse:
        raise HTTPException(status_code=503, detail='LLM provider is not configured. Set LLM_PROVIDER and provider credentials.')
