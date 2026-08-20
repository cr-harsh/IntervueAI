import type { Question } from '../types'
import { Badge } from './ui/Badge'
import { kindColor, diffColor } from '../constants/domains'

export function QuestionCard({ question }: { question: Question }) {
  return (
    <article className="glass rounded-lg p-5 transition hover:-translate-y-0.5 hover:border-blue-300/60">
      <div className="flex flex-wrap gap-2">
        <Badge className={kindColor[question.kind]}>{question.kind}</Badge>
        <Badge className={diffColor[question.difficulty]}>{question.difficulty}</Badge>
      </div>
      <h3 className="mt-4 text-lg leading-7 text-zinc-100">“{question.text}”</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {question.tags.map(tag => (
          <span key={tag} className="font-mono text-xs text-zinc-600">#{tag}</span>
        ))}
      </div>
    </article>
  )
}
