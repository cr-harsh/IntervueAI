import json
from unittest.mock import AsyncMock, MagicMock, patch

from fastapi.testclient import TestClient
from groq import APIConnectionError, APIStatusError, APITimeoutError, RateLimitError
import httpx
import pytest

from app.core.config import settings
from app.main import app
from app.schemas.interview import GenerateQuestionsRequest
from app.services.llm_provider import GroqProvider, UnconfiguredLLMProvider

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "intervueai-ai-service"
    assert "configured" in data


def test_unconfigured_provider_error():
    with patch.object(settings, "groq_api_key", ""):
        response = client.post(
            "/ai/generate-questions",
            json={
                "resume": "Software engineer with React and Python experience",
                "jobDescription": "Fullstack developer",
                "domain": "Full Stack",
                "experienceLevel": "Intermediate",
                "difficulty": "Medium",
                "questionCount": 3,
            },
        )
        assert response.status_code == 503
        assert "Groq is not configured" in response.json()["detail"]


def test_invalid_request_validation():
    # Missing required fields
    response = client.post(
        "/ai/generate-questions",
        json={"resume": "", "questionCount": 0},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_groq_provider_valid_generation():
    mock_client = MagicMock()
    mock_chat = MagicMock()
    mock_completions = MagicMock()

    mock_choice = MagicMock()
    mock_choice.message.content = json.dumps({
        "questions": [
            {
                "question": "What is event bubbling in JS?",
                "category": "Frontend",
                "difficulty": "Medium",
                "tags": ["javascript", "dom"],
            },
            {
                "question": "Explain closure in Python.",
                "category": "Backend",
                "difficulty": "Medium",
                "tags": ["python"],
            },
        ]
    })
    mock_completion = MagicMock()
    mock_completion.choices = [mock_choice]

    mock_completions.create = AsyncMock(return_value=mock_completion)
    mock_chat.completions = mock_completions
    mock_client.chat = mock_chat

    provider = GroqProvider(
        api_key="test_key",
        model="openai/gpt-oss-20b",
        client=mock_client,
    )

    req = GenerateQuestionsRequest(
        resume="Developer resume",
        jobDescription="Software Engineer",
        domain="Full Stack",
        experienceLevel="Intermediate",
        difficulty="Medium",
        questionCount=2,
    )

    result = await provider.generate_questions(req)
    assert len(result) == 2
    assert result[0].question == "What is event bubbling in JS?"
    assert mock_completions.create.call_count == 1


@pytest.mark.asyncio
async def test_groq_provider_wrong_question_count_retry():
    mock_client = MagicMock()
    mock_chat = MagicMock()
    mock_completions = MagicMock()

    # Returns 1 question when 2 are requested
    mock_choice = MagicMock()
    mock_choice.message.content = json.dumps({
        "questions": [
            {
                "question": "Single question returned",
                "category": "General",
                "difficulty": "Easy",
                "tags": [],
            }
        ]
    })
    mock_completion = MagicMock()
    mock_completion.choices = [mock_choice]

    mock_completions.create = AsyncMock(return_value=mock_completion)
    mock_chat.completions = mock_completions
    mock_client.chat = mock_chat

    provider = GroqProvider(
        api_key="test_key",
        model="openai/gpt-oss-20b",
        client=mock_client,
    )

    req = GenerateQuestionsRequest(
        resume="Developer resume",
        jobDescription="Software Engineer",
        domain="Full Stack",
        experienceLevel="Intermediate",
        difficulty="Medium",
        questionCount=2,
    )

    with pytest.raises(httpx.HTTPStatusError) if False else pytest.raises(Exception) as exc_info:
        await provider.generate_questions(req)

    assert "502" in str(exc_info.value) or exc_info.value.status_code == 502
    # Exactly 2 attempts (initial + 1 retry)
    assert mock_completions.create.call_count == 2


@pytest.mark.asyncio
async def test_groq_provider_rate_limit_no_unnecessary_retries():
    mock_client = MagicMock()
    mock_chat = MagicMock()
    mock_completions = MagicMock()

    mock_response = MagicMock()
    mock_response.headers = {"retry-after": "5"}

    mock_completions.create = AsyncMock(
        side_effect=RateLimitError(
            message="Rate limit exceeded",
            response=mock_response,
            body=None,
        )
    )
    mock_chat.completions = mock_completions
    mock_client.chat = mock_chat

    provider = GroqProvider(
        api_key="test_key",
        model="openai/gpt-oss-20b",
        client=mock_client,
    )

    req = GenerateQuestionsRequest(
        resume="Developer resume",
        jobDescription="Software Engineer",
        domain="Full Stack",
        experienceLevel="Intermediate",
        difficulty="Medium",
        questionCount=2,
    )

    with pytest.raises(Exception) as exc_info:
        await provider.generate_questions(req)

    assert exc_info.value.status_code == 429
    # Should fail immediately without retries
    assert mock_completions.create.call_count == 1
