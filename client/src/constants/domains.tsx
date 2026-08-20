import type { ReactNode } from 'react'
import { BrainCircuit, Layers3, Code2, ShieldCheck, Container, FileText, CloudIcon, NetworkIcon, Cable, Wrench, Rocket } from 'lucide-react'
import type { Domain, QuestionKind } from '../types'

export const domains: { name: Domain; icon: ReactNode }[] = [
  { name: 'Full Stack', icon: <Layers3 /> },
  { name: 'Frontend', icon: <Code2 /> },
  { name: 'Backend', icon: <Layers3 /> },
  { name: 'AI/ML', icon: <BrainCircuit /> },
  { name: 'Cyber-Security', icon: <ShieldCheck /> },
  { name: 'DevOps', icon: <Container /> },
  { name: 'Data Science', icon: <FileText /> },
  { name: 'Cloud Computing', icon: <CloudIcon /> },
  { name: 'CN & IP', icon: <NetworkIcon /> },
  { name: 'Electronics', icon: <Cable /> },
  { name: 'Mechanical', icon: <Wrench /> },
  { name: 'AeroSpace', icon: <Rocket /> },
]

export const kindColor: Record<QuestionKind, string> = {
  Technical: 'border-blue-400/40 bg-blue-500/15 text-blue-200',
  'Problem Solving': 'border-violet-400/40 bg-violet-500/15 text-violet-200',
  Behavioral: 'border-zinc-400/40 bg-zinc-500/15 text-zinc-200',
}

export const diffColor: Record<string, string> = {
  Easy: 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200',
  Medium: 'border-orange-400/40 bg-orange-500/15 text-orange-200',
  Hard: 'border-rose-400/40 bg-rose-500/15 text-rose-200',
}
