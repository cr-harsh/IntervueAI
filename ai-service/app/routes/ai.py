from fastapi import APIRouter, Depends
from app.schemas.interview import EvaluateAnswerRequest, EvaluationResponse, GenerateQuestionsRequest, GenerateQuestionsResponse
from app.services.interview_service import InterviewAIService
from app.services.llm_provider import UnconfiguredLLMProvider

router = APIRouter(prefix='/ai', tags=['ai'])
service = InterviewAIService(UnconfiguredLLMProvider())


def get_service() -> InterviewAIService:
    return service


@router.post('/generate-questions', response_model=GenerateQuestionsResponse)
async def generate_questions(request: GenerateQuestionsRequest, ai: InterviewAIService = Depends(get_service)) -> GenerateQuestionsResponse:
    return GenerateQuestionsResponse(questions=await ai.generate_questions(request))


@router.post('/evaluate-answer', response_model=EvaluationResponse)
async def evaluate_answer(request: EvaluateAnswerRequest, ai: InterviewAIService = Depends(get_service)) -> EvaluationResponse:
    return await ai.evaluate_answer(request)
