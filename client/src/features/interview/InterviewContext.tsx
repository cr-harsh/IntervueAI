import { createContext, useContext, useMemo, useReducer, type Dispatch, type ReactNode } from 'react'
import { createResults, defaultConfig } from '../../data/mock'
import type { Answer, Evaluation, InterviewConfig, Question, Session } from '../../types'

export type GeneratedQuestion = { question: string; category: string; difficulty: string; tags: string[] }

const questionKind = (category: string): 'Technical' | 'Problem Solving' | 'Behavioral' =>
  category.toLowerCase().includes('behavior')
    ? 'Behavioral'
    : category.toLowerCase().includes('problem') || category.toLowerCase().includes('design')
    ? 'Problem Solving'
    : 'Technical'

const questionDifficulty = (difficulty: string): 'Easy' | 'Medium' | 'Hard' =>
  difficulty.toLowerCase() === 'easy' ? 'Easy' : difficulty.toLowerCase() === 'hard' ? 'Hard' : 'Medium'

export type Action =
  | { type: 'CONFIGURE'; config: InterviewConfig }
  | { type: 'GENERATED'; config: InterviewConfig; interviewId: string; questions: (GeneratedQuestion | Question)[] }
  | { type: 'START' }
  | { type: 'SUBMIT'; answer: Answer; evaluation: Evaluation }
  | { type: 'NEXT' }
  | { type: 'RESET' }

const initial: Session = { config: defaultConfig, questions: [], answers: [], evaluations: [], currentIndex: 0 }

function reducer(state: Session, action: Action): Session {
  if (action.type === 'CONFIGURE') {
    return { ...state, config: action.config }
  }
  if (action.type === 'GENERATED') {
    const formattedQuestions: Question[] = action.questions.map((q, index) => {
      if ('text' in q && 'kind' in q) {
        return q as Question
      }
      const gq = q as GeneratedQuestion
      return {
        id: `q${index + 1}`,
        kind: questionKind(gq.category || 'Technical'),
        difficulty: questionDifficulty(gq.difficulty || 'Medium'),
        text: gq.question,
        tags: gq.tags || [],
        hint: `Focus on technical fundamentals and practical trade-offs for ${action.config.domain}.`,
      }
    })
    return {
      config: action.config,
      interviewId: action.interviewId,
      questions: formattedQuestions,
      answers: [],
      evaluations: [],
      currentIndex: 0,
    }
  }
  if (action.type === 'START') {
    return { ...state, startedAt: Date.now(), currentIndex: 0 }
  }
  if (action.type === 'SUBMIT') {
    return {
      ...state,
      answers: [...state.answers, action.answer],
      evaluations: [...state.evaluations, action.evaluation],
    }
  }
  if (action.type === 'NEXT') {
    const next = state.currentIndex + 1
    return next >= state.questions.length
      ? { ...state, currentIndex: next, results: createResults() }
      : { ...state, currentIndex: next }
  }
  return initial
}

const Context = createContext<{ session: Session; dispatch: Dispatch<Action> } | null>(null)

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [session, dispatch] = useReducer(reducer, initial)
  const value = useMemo(() => ({ session, dispatch }), [session])
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useInterview() {
  const value = useContext(Context)
  if (!value) throw new Error('Interview context unavailable')
  return value
}
