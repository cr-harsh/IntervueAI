import asyncio
import json
import sys
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.core.config import settings
from app.main import app
from app.schemas.interview import GenerateQuestionsRequest, EvaluateAnswerRequest
from app.services.llm_provider import GroqProvider
from groq import RateLimitError, APITimeoutError, APIStatusError

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "intervueai-ai-service"
    assert "configured" in data
    print("[PASS] test_health passed")


def test_unconfigured():
    with patch.object(settings, "groq_api_key", ""):
        response = client.post(
            "/ai/generate-questions",
            json={
                "resume": "Software engineer React",
                "jobDescription": "Fullstack engineer",
                "domain": "Full Stack",
                "experienceLevel": "Intermediate",
                "difficulty": "Medium",
                "questionCount": 3,
            },
        )
        assert response.status_code == 503, f"Expected 503, got {response.status_code}"
        assert "Groq is not configured" in response.json()["detail"]
    print("[PASS] test_unconfigured passed")


def test_request_validation():
    # Empty string or missing fields
    response = client.post(
        "/ai/generate-questions",
        json={"resume": "   ", "questionCount": 0},
    )
    assert response.status_code == 422, f"Expected 422, got {response.status_code}"
    print("[PASS] test_request_validation passed")


async def test_valid_generation():
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
    assert len(result) == 2, f"Expected 2 questions, got {len(result)}"
    assert result[0].question == "What is event bubbling in JS?"
    assert mock_completions.create.call_count == 1
    print("[PASS] test_valid_generation passed")


async def test_wrong_question_count_retry():
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

    failed = False
    try:
        await provider.generate_questions(req)
    except HTTPException as exc:
        failed = True
        assert exc.status_code == 502, f"Expected 502, got {exc.status_code}"

    assert failed, "Expected generate_questions to raise HTTPException"
    # Exactly 2 attempts (initial + 1 retry)
    assert mock_completions.create.call_count == 2
    print("[PASS] test_wrong_question_count_retry passed")


async def test_rate_limit_no_unnecessary_retries():
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

    failed = False
    try:
        await provider.generate_questions(req)
    except HTTPException as exc:
        failed = True
        assert exc.status_code == 429, f"Expected 429, got {exc.status_code}"

    assert failed, "Expected rate limit to raise HTTPException"
    assert mock_completions.create.call_count == 1
    print("[PASS] test_rate_limit_no_unnecessary_retries passed")


async def test_auth_failure_error_mapping():
    mock_client = MagicMock()
    mock_chat = MagicMock()
    mock_completions = MagicMock()

    mock_response = MagicMock()
    err = APIStatusError(
        message="Invalid API Key",
        response=mock_response,
        body=None,
    )
    err.status_code = 401
    mock_completions.create = AsyncMock(side_effect=err)
    mock_chat.completions = mock_completions
    mock_client.chat = mock_chat

    provider = GroqProvider(
        api_key="invalid_key",
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

    failed = False
    try:
        await provider.generate_questions(req)
    except HTTPException as exc:
        failed = True
        assert exc.status_code == 502, f"Expected 502, got {exc.status_code}"
        assert "authentication failure" in exc.detail

    assert failed, "Expected auth failure to raise HTTPException"
    assert mock_completions.create.call_count == 1
    print("[PASS] test_auth_failure_error_mapping passed")


async def main():
    print("--- Running AI Service Tests ---")
    test_health()
    test_unconfigured()
    test_request_validation()
    await test_valid_generation()
    await test_wrong_question_count_retry()
    await test_rate_limit_no_unnecessary_retries()
    await test_auth_failure_error_mapping()
    print("--- All AI Service Tests Passed! ---")


if __name__ == "__main__":
    asyncio.run(main())
