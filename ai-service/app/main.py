from typing import Any

from fastapi import FastAPI
from app.core.config import settings
from app.core.logger import logger
from app.routes.ai import router as ai_router


app = FastAPI(title='IntervueAI AI Service', version='0.1.0')
app.include_router(ai_router)


@app.on_event("startup")
async def startup_event():
    logger.info(
        "Starting IntervueAI AI Service (model=%s, configured=%s)",
        settings.groq_model,
        settings.is_groq_configured,
    )


@app.get('/health')
async def health() -> dict[str, Any]:
    return {
        'status': 'ok',
        'service': 'intervueai-ai-service',
        'provider': 'groq',
        'configured': settings.is_groq_configured,
        'model': settings.groq_model,
    }

