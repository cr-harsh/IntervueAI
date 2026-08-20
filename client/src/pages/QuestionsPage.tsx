import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, BrainCircuit, RotateCcw } from 'lucide-react'
import { Layout } from '../components/layout/Layout'
import { Button } from '../components/ui/Button'
import { QuestionCard } from '../components/QuestionCard'
import { useInterview } from '../features/interview/InterviewContext'
import { regenerateInterview } from '../services/interviewApi'

export function QuestionsPage() {
  const nav = useNavigate()
  const { session, dispatch } = useInterview()
  const q = session.questions

  const stats = useMemo(() => ({
    technical: q.filter(x => x.kind === 'Technical').length,
    problem: q.filter(x => x.kind === 'Problem Solving').length,
    behavioral: q.filter(x => x.kind === 'Behavioral').length,
  }), [q])

  const regenerate = async () => {
    if (!session.interviewId) return
    try {
      const generated = await regenerateInterview(session.interviewId)
      dispatch({ type: 'GENERATED', config: session.config, interviewId: generated.interviewId, questions: generated.questions })
    } catch (regenerationError) {
      window.alert(regenerationError instanceof Error ? regenerationError.message : 'Interview regeneration failed.')
    }
  }
  const start = () => { dispatch({ type: 'START' }); nav('/interview') }

  return (
    <Layout flow>
      <main className="mx-auto w-full max-w-7xl px-5 py-14 lg:px-8">
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-4xl font-semibold text-blue-200 glow-blue">Your Interview Is Ready</h1>
            <p className="mt-3 max-w-2xl text-zinc-400">Based on your resume, target role, and preferences, IntervueAI generated a focused interview for you.</p>
          </div>
          <div className="flex gap-3">
            <Button to="/setup" variant="secondary">← Edit Setup</Button>
            <Button onClick={start}>Start Interview <ArrowRight size={16} /></Button>
          </div>
        </header>

        <section className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            [q.length, 'Questions', 'text-zinc-100'],
            [stats.technical, 'Technical', 'text-blue-200'],
            [stats.problem, 'Problem Solving', 'text-violet-200'],
            [stats.behavioral, 'Behavioral', 'text-orange-200'],
          ].map(([number, label, color]) => (
            <div key={String(label)} className="glass rounded-lg p-4 text-center">
              <strong className={`font-display text-3xl ${color}`}>{number}</strong>
              <span className="mt-1 block font-mono text-[11px] uppercase tracking-wider text-zinc-500">{label}</span>
            </div>
          ))}
        </section>

        <div className="mt-7 flex flex-wrap gap-5 border-b border-zinc-800 pb-5 font-mono text-xs text-zinc-400">
          <span>DOMAIN: <b className="text-zinc-200">{session.config.domain}</b></span>
          <span>EXPERIENCE: <b className="text-zinc-200">{session.config.level}</b></span>
          <span>DIFFICULTY: <b className="text-zinc-200">{session.config.difficulty}</b></span>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-3">
          <section className="space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold">Your Interview Questions</h2>
              <button onClick={regenerate} className="flex items-center gap-1 font-mono text-xs text-blue-200 hover:text-blue-100">
                <RotateCcw size={14} />Regenerate All
              </button>
            </div>
            {q.map(question => <QuestionCard key={question.id} question={question} />)}
          </section>

          <aside className="space-y-5">
            <section className="ai-border rounded-lg p-6 glow-violet">
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-violet-200">
                <BrainCircuit size={20} />AI Preparation Insight
              </h2>
              <p className="mt-4 leading-6 text-zinc-400">
                Your profile is aligned with <span className="text-blue-200">{session.config.domain}</span>. Expect questions on architecture, security, performance, and how you communicate trade-offs.
              </p>
            </section>
            <section className="glass sticky top-24 rounded-lg p-6">
              <h2 className="font-display text-xl font-semibold">Ready to Begin?</h2>
              <div className="mt-5 space-y-3">
                <Button onClick={start} className="w-full">Start Interview <ArrowRight size={16} /></Button>
                <Button onClick={regenerate} variant="secondary" className="w-full">Regenerate Questions</Button>
                <Button to="/setup" variant="ghost" className="w-full">← Edit Setup</Button>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </Layout>
  )
}
