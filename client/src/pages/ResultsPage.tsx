import { useNavigate } from 'react-router-dom'
import { BrainCircuit, Check, ChevronRight, Play } from 'lucide-react'
import { Layout } from '../components/layout/Layout'
import { Button } from '../components/ui/Button'
import { Ring } from '../components/ui/Ring'
import { useInterview } from '../features/interview/InterviewContext'

export function ResultsPage() {
  const nav = useNavigate()
  const { session, dispatch } = useInterview()

  const result = session.results ?? {
    score: 82,
    technical: 86,
    communication: 84,
    problemSolving: 79,
    depth: 78,
    strengths: ['React and frontend architecture', 'REST API design', 'Technical communication', 'Structured debugging approach'],
    focusAreas: ['System design depth', 'Authentication security', 'Database optimization', 'Distributed systems'],
    insight: 'You showed strong full-stack fundamentals. Build more depth in system design, security, and database performance.',
  }

  const questionScores = session.questions.slice(0, 4).map((q, i) => ({
    q, score: session.evaluations[i]?.score ?? [88, 82, 74, 86][i],
  }))

  const restart = () => { dispatch({ type: 'RESET' }); nav('/setup') }
  const practice = () => { dispatch({ type: 'CONFIGURE', config: session.config }); dispatch({ type: 'START' }); nav('/interview') }
  const actions = [practice, () => nav('/questions'), restart]

  return (
    <Layout>
      <main className="mx-auto w-full max-w-7xl px-5 py-12 lg:px-8">
        <header>
          <h1 className="font-display text-5xl font-semibold tracking-tight">Interview Complete</h1>
          <p className="mt-2 text-lg text-zinc-400">You’ve completed your {session.config.domain} developer interview.</p>
        </header>

        <div className="mt-9 grid gap-6 md:grid-cols-12">
          <section className="ai-border flex flex-col items-center gap-7 rounded-xl p-7 md:col-span-8 md:flex-row">
            <Ring value={result.score} label="Overall Score" />
            <div>
              <h2 className="font-display text-2xl font-semibold">Overall Interview Score</h2>
              <p className="mt-2 text-lg text-orange-300">Strong Performance</p>
              <p className="mt-4 max-w-xl leading-7 text-zinc-400">
                You demonstrated solid knowledge across full-stack development. More depth in system design and security would make your answers even stronger.
              </p>
            </div>
          </section>

          <section className="ai-border glow-violet rounded-xl p-6 md:col-span-4">
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-violet-200">
              <BrainCircuit size={21} />AI Career Insight
            </h2>
            <p className="mt-4 leading-6 text-zinc-300">{result.insight}</p>
          </section>

          <section className="glass rounded-xl p-5 md:col-span-12">
            <h2 className="font-display text-3xl font-semibold">Performance Breakdown</h2>
            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                [result.technical, 'Technical Accuracy', '#a5b4fc'],
                [result.communication, 'Communication', '#a5b4fc'],
                [result.problemSolving, 'Problem Solving', '#fb923c'],
                [result.depth, 'Depth of Knowledge', '#fb923c'],
              ].map(([score, label, color]) => (
                <div key={String(label)} className="rounded-lg border border-zinc-700 bg-zinc-800/80 p-4">
                  <Ring value={Number(score)} label={String(label)} color={String(color)} small />
                </div>
              ))}
            </div>
          </section>

          <section className="glass rounded-xl p-5 md:col-span-7">
            <h2 className="font-display text-3xl font-semibold">Question Performance</h2>
            <div className="mt-5 space-y-2">
              {questionScores.map(({ q, score }, i) => (
                <div key={q.id} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/70 p-3">
                  <div className="flex items-center gap-3">
                    <span className="rounded bg-blue-500/10 px-2 py-1 font-mono text-sm text-blue-200">Q{i + 1}</span>
                    <div>
                      <strong className="block">{q.text.split(' ').slice(0, 3).join(' ')}…</strong>
                      <span className="font-mono text-xs text-zinc-500">{q.kind}</span>
                    </div>
                  </div>
                  <span className={score >= 80 ? 'font-mono text-blue-200' : 'font-mono text-orange-300'}>{score}/100</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6 md:col-span-5">
            <div className="glass rounded-xl p-5">
              <h2 className="font-display text-2xl font-semibold text-emerald-300">Your Strengths</h2>
              <ul className="mt-4 space-y-3">
                {result.strengths.map(x => (
                  <li key={x} className="flex gap-2 text-zinc-300"><Check size={17} className="text-emerald-400" />{x}</li>
                ))}
              </ul>
            </div>
            <div className="glass rounded-xl p-5">
              <h2 className="font-display text-2xl font-semibold text-orange-300">Focus Areas</h2>
              <ul className="mt-4 space-y-3">
                {result.focusAreas.map(x => (
                  <li key={x} className="flex gap-2 text-zinc-300"><ChevronRight size={17} className="text-orange-300" />{x}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <section className="mt-10">
          <h2 className="font-display text-3xl font-semibold">Next Steps</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {[
              ['Practice Weak Areas', 'Generate targeted questions for your focus areas.', 'Start Practice'],
              ['Review Interview', 'Read the generated questions and evaluations.', 'View Interview'],
              ['New Interview', 'Start a fresh session with a different focus.', 'Start New'],
            ].map(([title, copy, action], index) => (
              <article key={title} className="glass flex min-h-48 flex-col rounded-xl p-5">
                <Play className={index === 1 ? 'text-violet-300' : 'text-blue-200'} />
                <h3 className="mt-4 font-display text-2xl font-semibold">{title}</h3>
                <p className="mt-2 flex-1 text-sm text-zinc-400">{copy}</p>
                <Button variant={index === 2 ? 'primary' : 'secondary'} onClick={actions[index]} className="mt-5 w-full">{action}</Button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  )
}
