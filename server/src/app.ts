import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { errorHandler, notFound } from './middleware/errors.js'
import { interviewRouter } from './routes/interviewRoutes.js'

export const app = express()
app.use(cors({ origin: env.clientUrl }))
app.use(express.json({ limit: '1mb' }))
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'intervueai-server' }))
app.use('/api/interviews', interviewRouter)
app.use(notFound)
app.use(errorHandler)
