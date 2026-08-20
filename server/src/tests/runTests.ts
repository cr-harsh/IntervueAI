import assert from 'node:assert/strict'
import { aiClient } from '../services/aiClient.js'
import { Interview } from '../models/Interview.js'
import { generateQuestions } from '../controllers/interviewController.js'
import { AppError } from '../utils/AppError.js'
import { env } from '../config/env.js'

async function testAiClientErrorMapping() {
  console.log('Running testAiClientErrorMapping...')
  // Test with mock unconfigured URL
  const originalUrl = env.aiServiceUrl
  env.aiServiceUrl = ''
  try {
    await aiClient.generate({})
    assert.fail('Should have thrown AppError')
  } catch (err: any) {
    assert.equal(err instanceof AppError, true)
    assert.equal(err.statusCode, 503)
    assert.equal(err.message, 'AI service is not configured')
  } finally {
    env.aiServiceUrl = originalUrl
  }
  console.log('[PASS] testAiClientErrorMapping passed')
}

async function testInterviewStatusRollbackOnFailure() {
  console.log('Running testInterviewStatusRollbackOnFailure...')
  let savedStatus = ''
  const mockInterview: any = {
    _id: '507f1f77bcf86cd799439011',
    resume: 'Resume text',
    jobDescription: 'Job description text',
    domain: 'Full Stack',
    experienceLevel: 'Intermediate',
    difficulty: 'Medium',
    questionCount: 3,
    questions: [],
    status: 'draft',
    save: async function () {
      savedStatus = this.status
    },
  }

  // Mock Interview.findById
  const originalFindById = Interview.findById
  Interview.findById = (async () => mockInterview) as any

  // Mock aiClient.generate to throw a 502 error
  const originalGenerate = aiClient.generate
  aiClient.generate = async () => {
    throw new AppError(502, 'Groq rate limit exceeded')
  }

  const req: any = { params: { id: '507f1f77bcf86cd799439011' } }
  const res: any = { json: () => {}, status: () => res }

  let errorCaught = false
  try {
    await generateQuestions(req, res)
  } catch (err: any) {
    errorCaught = true
    assert.equal(err instanceof AppError, true)
    assert.equal(err.statusCode, 502)
  } finally {
    Interview.findById = originalFindById
    aiClient.generate = originalGenerate
  }

  assert.equal(errorCaught, true, 'Error should have been rethrown')
  assert.equal(mockInterview.status, 'draft', 'Interview status should have been rolled back to draft')
  assert.equal(savedStatus, 'draft', 'Final saved status must be draft')
  console.log('[PASS] testInterviewStatusRollbackOnFailure passed')
}

async function runAll() {
  console.log('--- Running Express Server Tests ---')
  await testAiClientErrorMapping()
  await testInterviewStatusRollbackOnFailure()
  console.log('--- All Express Server Tests Passed! ---')
}

runAll().catch(err => {
  console.error('Test runner failed:', err)
  process.exit(1)
})
