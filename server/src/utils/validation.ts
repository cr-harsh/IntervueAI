import { Types } from 'mongoose'
import { AppError } from './AppError.js'

const required = ['resume', 'jobDescription', 'domain', 'experienceLevel', 'interviewType', 'difficulty', 'questionCount'] as const
export function validateCreate(body: Record<string, unknown>) {
  const missing = required.filter(field => body[field] === undefined || body[field] === null || body[field] === '')
  if (missing.length) throw new AppError(400, 'Missing required fields', { fields: missing })
  if (typeof body.resume !== 'string' || typeof body.jobDescription !== 'string') throw new AppError(400, 'resume and jobDescription must be strings')
  if (typeof body.questionCount !== 'number' || !Number.isInteger(body.questionCount) || body.questionCount < 1 || body.questionCount > 50) throw new AppError(400, 'questionCount must be an integer between 1 and 50')
}
export function validateId(id: string) { if (!Types.ObjectId.isValid(id)) throw new AppError(400, 'Invalid interview id') }
export function validateAnswer(body: Record<string, unknown>) { if (typeof body.answer !== 'string' || !body.answer.trim()) throw new AppError(400, 'answer is required') }
