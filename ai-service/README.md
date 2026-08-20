# IntervueAI AI Service

FastAPI microservice handling AI question generation and technical answer evaluation via Groq LLM provider.

## Environment Variables

Copy `.env.example` to `.env`:

```bash
HOST=127.0.0.1
PORT=8000
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-20b
GROQ_TIMEOUT_SECONDS=30.0
GROQ_STRUCTURED_OUTPUT=true
```

## Running locally

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Start development server:
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

## API Endpoints

- `GET /health`: Health status and provider configuration check.
- `POST /ai/generate-questions`: Generate technical interview questions.
- `POST /ai/evaluate-answer`: Evaluate technical candidate answer.

## Running Tests

```bash
python -m pytest tests/
```
