import { Schema, model, type InferSchemaType } from 'mongoose'

const questionSchema = new Schema({
  question: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  difficulty: { type: String, required: true, trim: true },
  tags: { type: [String], default: [] },
  answer: { type: String, default: '' },
  evaluation: { type: Schema.Types.Mixed, default: null },
  score: { type: Number, min: 0, max: 100, default: null },
}, { _id: true })

const interviewSchema = new Schema({
  userId: { type: String, required: false, index: true },
  resume: { type: String, required: true, trim: true },
  jobDescription: { type: String, required: true, trim: true },
  jobUrl: { type: String, default: '', trim: true },
  domain: { type: String, required: true, trim: true },
  experienceLevel: { type: String, required: true, trim: true },
  interviewType: { type: String, required: true, trim: true },
  difficulty: { type: String, required: true, trim: true },
  questionCount: { type: Number, required: true, min: 1, max: 50 },
  questions: { type: [questionSchema], default: [] },
  status: { type: String, enum: ['draft', 'generating', 'ready', 'in_progress', 'completed'], default: 'draft' },
  overallScore: { type: Number, min: 0, max: 100, default: null },
}, { timestamps: true })

export type InterviewDocument = InferSchemaType<typeof interviewSchema>
export const Interview = model('Interview', interviewSchema)
