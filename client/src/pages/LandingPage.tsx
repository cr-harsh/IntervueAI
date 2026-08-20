import { ArrowRight, Sparkles, FileText, CircleHelp, BrainCircuit } from 'lucide-react'
import { Layout } from '../components/layout/Layout'
import { Badge } from '../components/ui/Badge'
import { SectionTitle } from '../components/layout/SectionTitle'
import { Button } from '../components/ui/Button'

export function LandingPage() {
  return (
    <Layout>
      <main>
        <section className="mx-auto grid min-h-[74vh] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8">
          <div>
            <Badge className="border-blue-400/30 bg-blue-500/10 text-blue-200">
              <Sparkles size={12} className="mr-1" />AI-POWERED INTERVIEW PREPARATION
            </Badge>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight text-zinc-100 md:text-6xl">
              Prepare Smarter.<br />
              <span className="bg-gradient-to-r from-blue-300 to-violet-300 bg-clip-text text-transparent">Interview Better.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-7 text-zinc-400">
              IntervueAI turns your resume and target job description into a focused technical interview built around the role you want.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/setup">Start Interview Preparation <ArrowRight size={16} /></Button>
              <Button variant="secondary" onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}>
                See How It Works
              </Button>
            </div>
          </div>
          <div className="glass glow-blue relative flex w-full items-center justify-center overflow-hidden rounded-2xl border border-zinc-800/80 p-2 shadow-2xl transition duration-300 hover:border-blue-400/40">
            <img
              src="/Gemini_Generated_Image_21d2p521d2p521d2.png"
              alt="AI Interview Preparation"
              className="h-auto w-full max-h-[500px] object-contain object-center rounded-xl shadow-lg transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionTitle title="Precision Context Analysis" copy="A focused interview starts with a faithful understanding of your background and the target role." />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              ['Resume Analysis', 'Understand the skills, technologies, and experience in your profile.', FileText],
              ['Job Description Analysis', 'Identify role requirements and the skills that matter most.', CircleHelp],
              ['Personalized Questions', 'Create technical challenges tailored to your actual context.', BrainCircuit],
            ].map(([title, text, Icon], index) => {
              const I = Icon as typeof FileText
              return (
                <article key={String(title)} className={`glass rounded-lg p-6 transition hover:-translate-y-1 hover:border-blue-400/50 ${index === 2 ? 'border-t-blue-300' : ''}`}>
                  <I className={index === 1 ? 'text-violet-300' : 'text-blue-200'} />
                  <h3 className="mt-5 font-display text-xl font-semibold">{String(title)}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{String(text)}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section id="domains" className="border-y border-zinc-900 bg-zinc-950/30">
          <div className="mx-auto max-w-7xl px-5 py-20 text-center lg:px-8">
            <SectionTitle title="Supported Technical Domains" copy="Comprehensive coverage across modern software engineering disciplines." />
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {['Full Stack', 'AI/ML', 'Backend', 'Frontend', 'Data Science', 'DevOps', 'Software Engineering', 'Cyber-Security', 'Aero Space', 'Mechanical', 'Cloud Computing', 'AeroSpace', 'Electrical'].map(d => (
                <Badge key={d} className="border-zinc-700 bg-zinc-900/70 px-4 py-2 text-zinc-200">{d}</Badge>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionTitle title="Execution Flow" />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              ['01', 'Upload Resume', 'Provide your technical profile for a relevant starting point.'],
              ['02', 'Add Job Description', 'Set the target role and its evaluation criteria.'],
              ['03', 'Generate Personalized Questions', 'Practice a synthesized technical evaluation.'],
            ].map(([n, t, c], i) => (
              <article key={n} className={`relative rounded-lg border p-6 ${i === 2 ? 'border-blue-300/40 bg-blue-400/5' : 'border-zinc-800 bg-[#121214]'}`}>
                <Badge className="absolute -top-3 -left-2 border-zinc-700 bg-[#121214] text-zinc-300">{n}</Badge>
                <h3 className="font-display text-xl font-semibold">{t}</h3>
                <p className="mt-3 text-sm text-zinc-400">{c}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
          <div className="glass rounded-xl bg-gradient-to-t from-blue-500/10 to-transparent p-10 text-center">
            <h2 className="font-display text-3xl font-semibold">Your next interview starts here.</h2>
            <p className="mx-auto mt-3 max-w-xl text-zinc-400">Turn your resume and job description into an interview preparation session.</p>
            <Button to="/setup" className="mt-6">Start Preparing</Button>
          </div>
        </section>
      </main>
    </Layout>
  )
}