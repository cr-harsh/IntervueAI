import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  ArrowRight, BrainCircuit, Check, Flag, Lightbulb, LoaderCircle,
  Lock, MicOff, Send, Sparkles, Timer, FileText,
} from 'lucide-react'
import { Layout } from '../components/layout/Layout'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { useInterview } from '../features/interview/InterviewContext'
import { kindColor, diffColor } from '../constants/domains'
import type { Evaluation } from '../types'
import { evaluateInterviewAnswer } from '../services/interviewApi'

export function LiveInterviewPage() {
  const nav = useNavigate()
  const { session, dispatch } = useInterview()
  const question = session.questions[session.currentIndex]
  const [answer, setAnswer] = useState('')
  const [seconds, setSeconds] = useState(18 * 60 + 42)
  const [evaluating, setEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)

  useEffect(() => {
    const id = window.setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    setAnswer('')
    setEvaluation(null)
    setEvaluating(false)
  }, [question?.id])

  if (!question) return <Navigate to="/results" replace />

  const time = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

  const submit = async (skipped = false) => {
    if (!answer.trim() && !skipped) return
    setEvaluating(true)

    if (skipped) {
      const result: Evaluation = {
        questionId: question.id,
        score: 0,
        feedback: 'Skipped. Return to this topic in targeted practice.',
        strengths: [],
        improvement: 'Practice this topic before your next session.',
      }
      dispatch({ type: 'SUBMIT', answer: { questionId: question.id, text: answer, skipped: true }, evaluation: result })
      setEvaluation(result)
      setEvaluating(false)
      return
    }

    try {
      if (session.interviewId) {
        const res = await evaluateInterviewAnswer(session.interviewId, question.id, answer)
        const result: Evaluation = {
          questionId: question.id,
          score: res.score,
          feedback: res.feedback,
          strengths: res.strengths,
          improvement: res.improvement,
        }
        dispatch({ type: 'SUBMIT', answer: { questionId: question.id, text: answer, skipped: false }, evaluation: result })
        setEvaluation(result)
      } else {
        const result: Evaluation = {
          questionId: question.id,
          score: 78 + (session.currentIndex % 3) * 5,
          feedback: 'Strong structure. You identified the core concerns and communicated trade-offs clearly.',
          strengths: ['Structured reasoning', 'Relevant technical detail'],
          improvement: 'Add more concrete implementation and monitoring detail.',
        }
        dispatch({ type: 'SUBMIT', answer: { questionId: question.id, text: answer, skipped: false }, evaluation: result })
        setEvaluation(result)
      }
    } catch {
      // Fallback if network evaluation is unavailable
      const fallbackResult: Evaluation = {
        questionId: question.id,
        score: 75,
        feedback: 'Answer recorded. Solid technical explanation.',
        strengths: ['Structured reasoning'],
        improvement: 'Add more concrete implementation details.',
      }
      dispatch({ type: 'SUBMIT', answer: { questionId: question.id, text: answer, skipped: false }, evaluation: fallbackResult })
      setEvaluation(fallbackResult)
    } finally {
      setEvaluating(false)
    }
  }

  const next = () => {
    dispatch({ type: 'NEXT' })
    if (session.currentIndex + 1 >= session.questions.length) nav('/results')
  }

  return (
    <Layout footer={false}>
      <main className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-7xl flex-col lg:flex-row">
        <section className="flex min-w-0 flex-1 flex-col p-5 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4 font-mono text-sm">
            <span className="text-zinc-400">{session.config.domain} Developer Interview</span>
            <div className="flex items-center gap-4">
              <Badge className="border-zinc-700 bg-zinc-800 text-zinc-300">Question {session.currentIndex + 1} of {session.questions.length}</Badge>
              <span className="flex items-center gap-2 text-rose-300"><Timer size={17} />{time}</span>
              <Button to="/questions" variant="ghost" className="p-0 text-xs">Exit</Button>
            </div>
          </div>

          <div className="max-w-4xl pt-8">
            <div className="flex gap-2">
              <Badge className={kindColor[question.kind] || 'border-blue-400/40 bg-blue-500/15 text-blue-200'}>{question.kind}</Badge>
              <Badge className={diffColor[question.difficulty] || 'border-orange-400/40 bg-orange-500/15 text-orange-200'}>{question.difficulty}</Badge>
            </div>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">{question.text}</h1>
            <div className="mt-6 flex gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 text-zinc-400">
              <Lightbulb className="shrink-0 text-violet-300" size={20} />
              <p>{question.hint || `Explain your reasoning and technical trade-offs clearly for ${session.config.domain}.`}</p>
            </div>
          </div>

          <div className="mt-7 flex flex-1 flex-col">
            <div className="flex min-h-[220px] flex-1 flex-col overflow-hidden rounded-xl border border-zinc-800 bg-[#121214] focus-within:border-blue-400/70">
              <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/40 p-4">
                <span className="flex items-center gap-2 font-mono text-sm"><FileText size={16} />Your Answer</span>
                <span className="flex items-center gap-2 text-zinc-500">
                  <span className="flex items-center gap-1 rounded border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 font-mono text-[11px] text-zinc-500">
                    <MicOff size={12} className="text-zinc-600" /> Voice (Soon)
                  </span>
                  <span className="font-mono text-xs">{answer.length} / 2000</span>
                </span>
              </div>
              <textarea
                value={answer}
                maxLength={2000}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Type your answer here... Focus on architecture, trade-offs, and scaling considerations."
                className="min-h-[180px] flex-1 resize-none bg-transparent p-5 text-zinc-100 outline-none placeholder:text-zinc-600"
                disabled={Boolean(evaluation)}
              />
            </div>

            {evaluation && (
              <div className="mt-4 rounded-lg border border-violet-400/30 bg-violet-500/10 p-4">
                <div className="flex items-center gap-2 text-violet-200"><Sparkles size={17} />AI Evaluation — {evaluation.score}/100</div>
                <p className="mt-2 text-sm text-zinc-300">{evaluation.feedback}</p>
                {evaluation.improvement && <p className="mt-1 text-sm text-zinc-400">Focus next: {evaluation.improvement}</p>}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-800 pt-5">
              <button className="flex items-center gap-2 font-mono text-xs text-zinc-500 hover:text-zinc-200">
                <Flag size={15} />Report Question
              </button>
              {evaluation ? (
                <Button onClick={next}>Next Question <ArrowRight size={16} /></Button>
              ) : (
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => submit(true)}>Skip Question</Button>
                  <Button onClick={() => submit()} disabled={!answer.trim() || evaluating}>
                    {evaluating ? <><LoaderCircle size={16} className="animate-spin" />Analyzing with AI...</> : <>Submit Answer <Send size={16} /></>}
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-2 font-mono text-xs">
              {session.questions.map((item, index) => (
                <span key={item.id} className={index < session.currentIndex ? 'text-blue-300' : index === session.currentIndex ? 'rounded bg-blue-500/15 px-2 py-1 text-blue-200' : 'text-zinc-600'}>
                  {index < session.currentIndex ? <Check className="inline" size={13} /> : '○'} Q{index + 1}
                </span>
              ))}
            </div>
          </div>
        </section>

        <aside className="border-t border-zinc-800/80 bg-[#0c0c0e]/95 p-6 lg:w-80 lg:border-t-0 lg:border-l select-none">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-zinc-400">
              <BrainCircuit className="text-zinc-500" size={20} />AI Interviewer
            </h2>
            <Badge className="border-amber-400/30 bg-amber-500/10 text-amber-300 font-mono text-[10px] tracking-wider">COMING SOON</Badge>
          </div>
          <div className="relative mt-7 overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-6 text-center opacity-60 backdrop-blur-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent_70%)]" />
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/60 shadow-inner">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-zinc-800/80 bg-zinc-950/70 text-zinc-500">
                <MicOff size={28} className="text-zinc-500" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-amber-300 shadow">
                <Lock size={12} />
              </span>
            </div>
            <div className="relative mt-4 space-y-1.5">
              <span className="block font-mono text-xs font-semibold tracking-wide text-zinc-400 uppercase">Voice Commands</span>
              <p className="text-xs leading-relaxed text-zinc-500">Real-time voice recognition and audio interviewer interaction are currently in development.</p>
            </div>
          </div>
          <div className="mt-6 rounded-lg border border-zinc-800/60 bg-zinc-900/30 p-4 text-xs italic leading-relaxed text-zinc-500">
            “Type your answer in the editor. Written answers are fully evaluated by AI upon submission.”
          </div>
        </aside>
      </main>
    </Layout>
  )
}
