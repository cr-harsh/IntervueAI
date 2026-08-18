from fastapi import FastAPI
from app.core.config import settings
from app.routes.ai import router as ai_router

app = FastAPI(title='IntervueAI AI Service', version='0.1.0')
app.include_router(ai_router)


@app.get('/health')
async def health() -> dict[str, str]:
    return {'status': 'ok', 'service': 'intervueai-ai-service', 'provider': settings.llm_provider}
