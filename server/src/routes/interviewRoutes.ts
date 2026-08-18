import { Router } from 'express'
import { createInterview, generateQuestions, getInterview, getResults, submitAnswer } from '../controllers/interviewController.js'

export const interviewRouter = Router()
interviewRouter.post('/', createInterview)
interviewRouter.get('/:id', getInterview)
interviewRouter.post('/:id/generate', generateQuestions)
interviewRouter.post('/:id/questions/:questionId/answer', submitAnswer)
interviewRouter.get('/:id/results', getResults)
