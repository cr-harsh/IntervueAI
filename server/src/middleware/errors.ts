import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../utils/AppError.js'

export function notFound(_req: Request, _res: Response, next: NextFunction) { next(new AppError(404, 'Route not found')) }
export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  const appError = error instanceof AppError ? error : new AppError(500, 'Internal server error')
  res.status(appError.statusCode).json({ error: { message: appError.message, ...(appError.details ? { details: appError.details } : {}) } })
}
