import type { Request, Response } from 'express'
import { Interview } from '../models/Interview.js'
import { aiClient } from '../services/aiClient.js'
import { AppError } from '../utils/AppError.js'
import { validateAnswer, validateCreate, validateId } from '../utils/validation.js'

export async function createInterview(req: Request, res: Response) {
  validateCreate(req.body)
  const interview = await Interview.create(req.body)
  res.status(201).json({ interview })
}
export async function getInterview(req: Request, res: Response) {
  const interviewId = String(req.params.id); validateId(interviewId)
  const interview = await Interview.findById(interviewId)
  if (!interview) throw new AppError(404, 'Interview not found')
  res.json({ interview })
}
export async function generateQuestions(req: Request, res: Response) {
  const interviewId = String(req.params.id); validateId(interviewId)
  const interview = await Interview.findById(interviewId)
  if (!interview) throw new AppError(404, 'Interview not found')
  console.info('[interview] generating questions', { interviewId, domain: interview.domain, questionCount: interview.questionCount, resumeChars: interview.resume.length, jobDescriptionChars: interview.jobDescription.length })
  const previousStatus = interview.status
  interview.status = 'generating'; await interview.save()
  try {
    const generated = await aiClient.generate({ resume: interview.resume, jobDescription: interview.jobDescription, domain: interview.domain, experienceLevel: interview.experienceLevel, difficulty: interview.difficulty, questionCount: interview.questionCount })
    if (!Array.isArray(generated.questions) || generated.questions.length === 0) throw new AppError(502, 'AI service returned no questions')
    interview.questions.splice(0, interview.questions.length, ...generated.questions.map(question => ({ ...question, answer: '', evaluation: null, score: null })))
    interview.status = 'ready'; await interview.save()
    console.info('[interview] questions generated', { interviewId, questionCount: generated.questions.length })
    res.json({ questions: interview.questions, status: interview.status })
  } catch (error) {
    interview.status = previousStatus === 'generating' ? 'draft' : (previousStatus || 'draft')
    await interview.save()
    console.error('[interview] question generation failed', { interviewId, error: error instanceof Error ? error.message : 'unknown error' })
    throw error
  }
}
export async function submitAnswer(req: Request, res: Response) {
  const interviewId = String(req.params.id); const questionId = String(req.params.questionId); validateId(interviewId); validateId(questionId); validateAnswer(req.body)
  const interview = await Interview.findById(interviewId)
  if (!interview) throw new AppError(404, 'Interview not found')
  const question = interview.questions.id(questionId)
  if (!question) throw new AppError(404, 'Question not found')
  const evaluation = await aiClient.evaluate({ question: question.question, answer: req.body.answer, resume: interview.resume, jobDescription: interview.jobDescription, domain: interview.domain })
  question.answer = req.body.answer; question.evaluation = evaluation; question.score = evaluation.score
  interview.status = 'in_progress'; await interview.save()
  res.json({ evaluation, question })
}
export async function getResults(req: Request, res: Response) {
  const interviewId = String(req.params.id); validateId(interviewId)
  const interview = await Interview.findById(interviewId)
  if (!interview) throw new AppError(404, 'Interview not found')
  const evaluated = interview.questions.filter(question => typeof question.score === 'number')
  const overallScore = evaluated.length ? Math.round(evaluated.reduce((total, question) => total + (question.score ?? 0), 0) / evaluated.length) : null
  if (overallScore !== null) { interview.overallScore = overallScore; if (evaluated.length === interview.questions.length) interview.status = 'completed'; await interview.save() }
  const evaluations = evaluated.map(question => ({ questionId: question._id, question: question.question, category: question.category, score: question.score, evaluation: question.evaluation }))
  const strengths = evaluated.flatMap(question => { const e = question.evaluation as { strengths?: string[] } | null; return e?.strengths ?? [] })
  const improvements = evaluated.flatMap(question => { const e = question.evaluation as { improvements?: string[] } | null; return e?.improvements ?? [] })
  res.json({ overallScore, questionScores: evaluations, strengths: [...new Set(strengths)], improvementAreas: [...new Set(improvements)], status: interview.status })
}
