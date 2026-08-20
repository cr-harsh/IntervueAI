export type Domain = 'Full Stack' | 'Frontend' | 'Backend' | 'AI/ML' | 'Cyber-Security' | 'DevOps' | 'Data Science' | 'Cloud Computing' | 'CN & IP' | 'Electronics' | 'Mechanical' | 'AeroSpace'
export type Level = 'Beginner' | 'Intermediate' | 'Advanced'
export type InterviewType = 'Technical' | 'Behavioral' | 'Mixed'
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Adaptive'
export type QuestionKind = 'Technical' | 'Problem Solving' | 'Behavioral'
export interface InterviewConfig { domain: Domain; level: Level; type: InterviewType; difficulty: Difficulty; questionCount: number; jobDescription: string; jobUrl: string; resumeName: string; resumeText: string }
export interface Question { id: string; kind: QuestionKind; difficulty: 'Easy' | 'Medium' | 'Hard'; text: string; tags: string[]; hint: string }
export interface Answer { questionId: string; text: string; skipped?: boolean }
export interface Evaluation { questionId: string; score: number; feedback: string; strengths: string[]; improvement: string }
export interface Result { score: number; technical: number; communication: number; problemSolving: number; depth: number; strengths: string[]; focusAreas: string[]; insight: string }
export interface Session { config: InterviewConfig; questions: Question[]; answers: Answer[]; evaluations: Evaluation[]; currentIndex: number; interviewId?: string; startedAt?: number; results?: Result }
