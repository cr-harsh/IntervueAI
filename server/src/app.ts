import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { errorHandler, notFound } from './middleware/errors.js'
import { interviewRouter } from './routes/interviewRoutes.js'

export const app = express()
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (
      origin === env.clientUrl ||
      /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
    ) {
      return callback(null, true)
    }
    return callback(new Error(`CORS origin not allowed: ${origin}`))
  },
  credentials: true,
}))
app.use(express.json({ limit: '1mb' }))
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'intervueai-server' }))
app.use('/api/interviews', interviewRouter)
app.use(notFound)
app.use(errorHandler)
