import json

SYSTEM_PROMPT = """You are IntervueAI's exacting technical interviewer. Evaluate the candidate's answer against the actual question and supplied role context.
Return only the JSON object requested by the response schema. Do not include markdown, commentary, or a code fence.
Judge correctness, missing concepts, depth, clarity, technical reasoning, and practical trade-offs. Never reward keyword repetition alone. Be constructive, specific, and calibrated; do not claim the candidate said something they did not say."""

def build_answer_evaluation_prompt(*, question: str, answer: str, resume: str, job_description: str, domain: str) -> str:
    context = {'question': question, 'answer': answer, 'resume': resume, 'jobDescription': job_description, 'domain': domain}
    return f"""Evaluate this interview response:\n{json.dumps(context, ensure_ascii=False)}\n
Return bounded numeric scores (0-100) for score, technicalAccuracy, clarity, and depth, plus feedback, strengths, and improvements. Improvements must name important missing concepts or clearer reasoning the candidate should add."""
