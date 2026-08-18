import { createContext, useContext, useMemo, useReducer, type Dispatch, type ReactNode } from 'react'
import { createQuestions, createResults, defaultConfig } from '../../data/mock'
import type { Answer, Evaluation, InterviewConfig, Session } from '../../types'
type Action = { type: 'CONFIGURE'; config: InterviewConfig } | { type: 'START' } | { type: 'SUBMIT'; answer: Answer; evaluation: Evaluation } | { type: 'NEXT' } | { type: 'RESET' }
const initial: Session = { config: defaultConfig, questions: createQuestions(defaultConfig), answers: [], evaluations: [], currentIndex: 0 }
function reducer(state: Session, action: Action): Session { if (action.type === 'CONFIGURE') return { config: action.config, questions: createQuestions(action.config), answers: [], evaluations: [], currentIndex: 0 }; if (action.type === 'START') return { ...state, startedAt: Date.now(), currentIndex: 0 }; if (action.type === 'SUBMIT') return { ...state, answers: [...state.answers, action.answer], evaluations: [...state.evaluations, action.evaluation] }; if (action.type === 'NEXT') { const next = state.currentIndex + 1; return next >= state.questions.length ? { ...state, currentIndex: next, results: createResults() } : { ...state, currentIndex: next } }; return initial }
const Context = createContext<{ session: Session; dispatch: Dispatch<Action> } | null>(null)
export function InterviewProvider({ children }: { children: ReactNode }) { const [session, dispatch] = useReducer(reducer, initial); const value = useMemo(() => ({ session, dispatch }), [session]); return <Context.Provider value={value}>{children}</Context.Provider> }
export function useInterview() { const value = useContext(Context); if (!value) throw new Error('Interview context unavailable'); return value }
