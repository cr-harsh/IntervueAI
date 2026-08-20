import type { InterviewConfig } from '../types'

export type ApiQuestion = { _id?: string; question: string; category: string; difficulty: string; tags: string[] }
export type GenerateResponse = { interviewId: string; questions: ApiQuestion[] }

const apiBase = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:4000/api'

async function request<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    const msg = payload?.error?.message ?? payload?.error?.details?.detail ?? payload?.message ?? payload?.detail ?? `Request failed (${response.status})`
    throw new Error(msg)
  }
  return payload as T
}

export async function generateInterview(config: InterviewConfig): Promise<GenerateResponse> {
  const created = await request<{ interview: { _id: string } }>('/interviews', {
    resume: config.resumeText,
    jobDescription: config.jobDescription,
    jobUrl: config.jobUrl,
    domain: config.domain,
    experienceLevel: config.level,
    interviewType: config.type,
    difficulty: config.difficulty,
    questionCount: Number(config.questionCount),
  })
  const generated = await request<{ questions: ApiQuestion[] }>(`/interviews/${created.interview._id}/generate`, {})
  return { interviewId: created.interview._id, questions: generated.questions }
}

export async function regenerateInterview(interviewId: string): Promise<GenerateResponse> {
  const generated = await request<{ questions: ApiQuestion[] }>(`/interviews/${interviewId}/generate`, {})
  return { interviewId, questions: generated.questions }
}

export async function evaluateInterviewAnswer(
  interviewId: string,
  questionId: string,
  answer: string,
): Promise<{ score: number; feedback: string; strengths: string[]; improvement: string }> {
  const data = await request<{ evaluation: { score: number; feedback: string; strengths: string[]; improvements: string[] } }>(
    `/interviews/${interviewId}/questions/${questionId}/answer`,
    { answer },
  )
  const ev = data.evaluation
  return {
    score: ev?.score ?? 80,
    feedback: ev?.feedback ?? 'Evaluation recorded.',
    strengths: ev?.strengths ?? [],
    improvement: Array.isArray(ev?.improvements) ? ev.improvements.join('. ') : (ev?.improvements || 'Keep practicing.'),
  }
}