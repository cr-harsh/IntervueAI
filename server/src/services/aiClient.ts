import { env } from '../config/env.js'
import { AppError } from '../utils/AppError.js'

type GeneratedQuestion = { question: string; category: string; difficulty: string; tags: string[] }
type Evaluation = { score: number; technicalAccuracy: number; clarity: number; depth: number; feedback: string; strengths: string[]; improvements: string[] }

async function callAi<T>(path: string, body: unknown): Promise<T> {
  if (!env.aiServiceUrl) throw new AppError(503, 'AI service is not configured')
  let response: Response
  try {
    response = await fetch(`${env.aiServiceUrl.replace(/\/$/, '')}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(35_000),
    })
  } catch (error: any) {
    if (error?.name === 'TimeoutError' || error?.name === 'AbortError') {
      throw new AppError(504, 'AI service request timed out')
    }
    throw new AppError(503, 'AI service is unavailable')
  }

  const payload: any = await response.json().catch(() => null)
  if (!response.ok) {
    const statusCode = response.status >= 400 && response.status < 600 ? response.status : 502
    const message = typeof payload?.detail === 'string' ? payload.detail : typeof payload?.message === 'string' ? payload.message : 'AI service request failed'
    throw new AppError(statusCode, message, payload)
  }
  return payload as T
}

export const aiClient = {
  generate: (payload: unknown) => callAi<{ questions: GeneratedQuestion[] }>('/ai/generate-questions', payload),
  evaluate: (payload: unknown) => callAi<Evaluation>('/ai/evaluate-answer', payload),
}

