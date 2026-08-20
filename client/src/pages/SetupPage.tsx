import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, FileText, LoaderCircle, Upload, X } from 'lucide-react'
import { Layout } from '../components/layout/Layout'
import { Button } from '../components/ui/Button'
import { Segmented } from '../components/ui/Segmented'
import { useInterview } from '../features/interview/InterviewContext'
import { domains } from '../constants/domains'
import type { Difficulty, InterviewConfig, InterviewType, Level } from '../types'
import { generateInterview } from '../services/interviewApi'

export function SetupPage() {
  const nav = useNavigate()
  const { dispatch, session } = useInterview()
  const [config, setConfig] = useState<InterviewConfig>({
    ...session.config,
    resumeText: session.config.resumeText || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = <K extends keyof InterviewConfig>(key: K, value: InterviewConfig[K]) =>
    setConfig(s => ({ ...s, [key]: value }))

  const handleFileUpload = (file?: File) => {
    if (!file) return
    update('resumeName', file.name)
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result
      if (typeof content === 'string' && content.trim()) {
        update('resumeText', content)
      }
    }
    // Read text files, markdown, code, etc.
    reader.readAsText(file)
  }

  const submit = async () => {
    const effectiveResume = config.resumeText.trim() || (config.resumeName ? `Resume file: ${config.resumeName}` : '')
    if (!effectiveResume || config.jobDescription.trim().length < 20) {
      setError('Please provide your resume content (or file) and a job description to generate relevant questions.')
      return
    }

    setLoading(true)
    setError('')
    const finalConfig: InterviewConfig = {
      ...config,
      resumeText: effectiveResume,
    }

    try {
      const generated = await generateInterview(finalConfig)
      dispatch({ type: 'GENERATED', config: finalConfig, interviewId: generated.interviewId, questions: generated.questions })
      nav('/questions')
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : 'Interview question generation failed. Please check AI service connectivity.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout flow>
      <main className="mx-auto w-full max-w-5xl px-5 py-14 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-semibold">Create Your Interview</h1>
          <p className="mt-3 text-zinc-400">Tell us about the role you’re preparing for and we’ll create a personalized technical interview.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="glass rounded-xl p-5">
            <h2 className="font-display text-2xl font-semibold">Your Resume</h2>
            <p className="mt-2 text-sm text-zinc-400">Upload your resume so questions reflect your experience.</p>
            <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-700 p-10 text-center transition hover:border-blue-400">
              <Upload className="text-zinc-400" size={28} />
              <span className="mt-3 font-mono text-sm">Upload resume file</span>
              <span className="mt-1 text-xs text-zinc-500">.pdf, .txt, .md, .doc, .docx</span>
              <input
                className="hidden"
                type="file"
                accept=".pdf,.doc,.docx,.txt,.md"
                onChange={e => handleFileUpload(e.target.files?.[0])}
              />
            </label>
            {config.resumeName && (
              <div className="mt-4 flex items-center justify-between rounded-md border border-zinc-700 bg-zinc-950 p-3">
                <span className="flex items-center gap-2 font-mono text-xs text-blue-200">
                  <FileText size={16} />{config.resumeName}
                </span>
                <button type="button" onClick={() => { update('resumeName', ''); update('resumeText', '') }}>
                  <X size={15} className="text-zinc-400 hover:text-zinc-100" />
                </button>
              </div>
            )}
          </section>

          <section className="glass rounded-xl p-5">
            <h2 className="font-display text-2xl font-semibold">Target Job Description</h2>
            <p className="mt-2 text-sm text-zinc-400">Paste the job description for the role you’re preparing for.</p>
            <textarea
              value={config.jobDescription}
              onChange={e => update('jobDescription', e.target.value)}
              placeholder="Paste job description here (e.g. required skills, responsibilities, architecture needs)..."
              className="mt-5 h-44 w-full resize-none rounded-md border border-zinc-700 bg-zinc-950 p-3 text-sm outline-none placeholder:text-zinc-600 focus:border-blue-400"
            />
            <label className="mt-4 block font-mono text-xs text-zinc-400">
              JOB POSTING URL (OPTIONAL)
              <input
                value={config.jobUrl}
                onChange={e => update('jobUrl', e.target.value)}
                placeholder="https://..."
                className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-950 p-2 text-sm outline-none focus:border-blue-400"
              />
            </label>
          </section>
        </div>

        <section className="glass mt-6 rounded-xl p-5">
          <h2 className="font-display text-2xl font-semibold">Choose Your Interview Domain</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {domains.map(d => (
              <button
                type="button"
                key={d.name}
                onClick={() => update('domain', d.name)}
                className={`rounded-lg border p-4 text-center transition ${
                  config.domain === d.name ? 'border-blue-300 bg-blue-500/10 text-blue-200 glow-blue' : 'border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-blue-400/60'
                }`}
              >
                <span className="mx-auto flex w-fit">{d.icon}</span>
                <span className="mt-2 block font-mono text-xs">{d.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="glass mt-6 rounded-xl p-5">
          <h2 className="font-display text-2xl font-semibold">Interview Preferences</h2>
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            <label className="font-mono text-xs text-zinc-400">
              EXPERIENCE LEVEL
              <Segmented options={['Beginner', 'Intermediate', 'Advanced'] as Level[]} value={config.level} onChange={v => update('level', v)} />
            </label>
            <label className="font-mono text-xs text-zinc-400">
              INTERVIEW TYPE
              <Segmented options={['Technical', 'Behavioral', 'Mixed'] as InterviewType[]} value={config.type} onChange={v => update('type', v)} />
            </label>
            <label className="font-mono text-xs text-zinc-400">
              DIFFICULTY
              <Segmented options={['Easy', 'Medium', 'Hard', 'Adaptive'] as Difficulty[]} value={config.difficulty} onChange={v => update('difficulty', v)} />
            </label>
            <label className="font-mono text-xs text-zinc-400">
              NUMBER OF QUESTIONS
              <Segmented options={[5, 10, 15, 20].map(String)} value={String(config.questionCount)} onChange={v => update('questionCount', Number(v))} />
            </label>
          </div>
        </section>

        {error && (
          <div role="alert" className="mt-5 rounded-lg border border-rose-500/40 bg-rose-500/10 p-4 text-center text-sm text-rose-300">
            {error}
          </div>
        )}

        <div className="mt-9 text-center">
          <Button onClick={submit} disabled={loading} className="px-8 py-4 text-base">
            {loading ? <><LoaderCircle className="animate-spin" size={17} />Generating Questions with Groq AI...</> : <>Generate My Interview <ArrowRight size={18} /></>}
          </Button>
          <p className="mx-auto mt-4 max-w-md text-xs text-zinc-500">
            Personalized questions will be generated dynamically by Groq LLM tailored to your background and role.
          </p>
        </div>
      </main>
    </Layout>
  )
}
