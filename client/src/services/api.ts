import type { InterviewConfig, Question, Evaluation, Result } from '../types'

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:4000/api'

export interface BackendQuestion {
  _id: string
  question: string
  category: string
  difficulty: string
  tags: string[]
  answer?: string
  score?: number | null
  evaluation?: any
}

export interface BackendInterview {
  _id: string
  domain: string
  experienceLevel: string
  interviewType: string
  difficulty: string
  questionCount: number
  resume: string
  jobDescription: string
  questions: BackendQuestion[]
  status: string
}

export async function createAndGenerateInterview(config: InterviewConfig): Promise<{ interviewId: string; questions: Question[] }> {
  const resumeContent = config.resumeText || config.resumeName || 'Resume text provided'

  // 1. Create interview record
  const createRes = await fetch(`${API_BASE}/interviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      resume: resumeContent,
      jobDescription: config.jobDescription,
      jobUrl: config.jobUrl || '',
      domain: config.domain,
      experienceLevel: config.level,
      interviewType: config.type,
      difficulty: config.difficulty,
      questionCount: Number(config.questionCount),
    }),
  })

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}))
    throw new Error(err.message || err.error?.message || `Failed to create interview (${createRes.status})`)
  }

  const { interview }: { interview: BackendInterview } = await createRes.json()
  const interviewId = interview._id

  // 2. Generate questions via AI
  const genRes = await fetch(`${API_BASE}/interviews/${interviewId}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!genRes.ok) {
    const err = await genRes.json().catch(() => ({}))
    throw new Error(err.message || err.error?.message || err.error?.details?.detail || `Failed to generate questions (${genRes.status})`)
  }

  const genData = await genRes.json()
  const rawQuestions: BackendQuestion[] = genData.questions || []

  const mappedQuestions: Question[] = rawQuestions.map((q, index) => ({
    id: q._id || `q_${index + 1}`,
    text: q.question,
    kind: (q.category as any) || 'Technical',
    difficulty: (q.difficulty as any) || 'Medium',
    tags: q.tags || [],
    hint: `Focus on relevant concepts and practical trade-offs for ${config.domain}.`,
  }))

  return { interviewId, questions: mappedQuestions }
}

export async function submitQuestionAnswer(
  interviewId: string,
  questionId: string,
  answer: string,
): Promise<Evaluation> {
  const res = await fetch(`${API_BASE}/interviews/${interviewId}/questions/${questionId}/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answer }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || err.error?.message || 'Failed to submit answer for evaluation')
  }

  const data = await res.json()
  const ev = data.evaluation
  return {
    questionId,
    score: ev.score ?? 80,
    feedback: ev.feedback ?? 'Evaluation recorded.',
    strengths: ev.strengths ?? [],
    improvement: Array.isArray(ev.improvements) ? ev.improvements.join('. ') : (ev.improvements || 'Continue practicing.'),
  }
}

export async function fetchInterviewResults(interviewId: string): Promise<Partial<Result>> {
  const res = await fetch(`${API_BASE}/interviews/${interviewId}/results`)
  if (!res.ok) return {}
  const data = await res.json()
  return {
    score: data.overallScore ?? 80,
    strengths: data.strengths ?? [],
    focusAreas: data.improvementAreas ?? [],
  }
}
