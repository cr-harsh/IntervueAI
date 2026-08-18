from app.schemas.interview import EvaluateAnswerRequest, EvaluationResponse, GenerateQuestionsRequest, GeneratedQuestion
from app.services.llm_provider import LLMProvider


class InterviewAIService:
    def __init__(self, provider: LLMProvider):
        self.provider = provider

    async def generate_questions(self, request: GenerateQuestionsRequest) -> list[GeneratedQuestion]:
        # Provider output is validated by the Pydantic GeneratedQuestion schema.
        return await self.provider.generate_questions(request)

    async def evaluate_answer(self, request: EvaluateAnswerRequest) -> EvaluationResponse:
        # Provider output is validated by the Pydantic EvaluationResponse schema.
        return await self.provider.evaluate_answer(request)
