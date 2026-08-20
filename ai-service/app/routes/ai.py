from fastapi import APIRouter, Depends
from app.core.config import settings
from app.schemas.interview import EvaluateAnswerRequest, EvaluationResponse, GenerateQuestionsRequest, GenerateQuestionsResponse
from app.services.interview_service import InterviewAIService
from app.services.llm_provider import create_llm_provider
from app.core.logger import logger

router = APIRouter(prefix='/ai', tags=['ai'])


def get_service() -> InterviewAIService:
    return InterviewAIService(create_llm_provider(settings))


@router.post('/generate-questions', response_model=GenerateQuestionsResponse)
async def generate_questions(request: GenerateQuestionsRequest, ai: InterviewAIService = Depends(get_service)) -> GenerateQuestionsResponse:
    logger.info('Question generation requested (domain=%s, experience=%s, difficulty=%s, count=%d, resume_chars=%d, jd_chars=%d)', request.domain, request.experienceLevel, request.difficulty, request.questionCount, len(request.resume), len(request.jobDescription))
    return GenerateQuestionsResponse(questions=await ai.generate_questions(request))


@router.post('/evaluate-answer', response_model=EvaluationResponse)
async def evaluate_answer(request: EvaluateAnswerRequest, ai: InterviewAIService = Depends(get_service)) -> EvaluationResponse:
    return await ai.evaluate_answer(request)

