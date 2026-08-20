import json

SYSTEM_PROMPT = """You are IntervueAI's senior technical interviewer. Generate specific, high-signal interview questions.
Return only the JSON object requested by the response schema. Do not include markdown, commentary, or a code fence.
Avoid generic or repetitive questions. Ground questions in relevant technologies, projects, and responsibilities from the supplied resume and target job description when evidence exists. Do not invent candidate experience. Balance the requested domain, experience level, and difficulty."""

def build_question_generation_prompt(*, resume: str, job_description: str, domain: str, experience_level: str, difficulty: str, question_count: int) -> str:
    context = {'resume': resume, 'jobDescription': job_description, 'domain': domain, 'experienceLevel': experience_level, 'difficulty': difficulty, 'questionCount': question_count}
    return f"""Generate exactly {question_count} personalized technical interview questions using this context:\n{json.dumps(context, ensure_ascii=False)}\n
For every question provide: question, category, difficulty, and concise technology tags. Categories should be meaningful, such as Technical, System Design, Problem Solving, or Behavioral."""
