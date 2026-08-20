export function SectionTitle({ title, copy }: { title: string; copy?: string }) {
  return (
    <div>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-zinc-100">{title}</h2>
      {copy && <p className="mt-2 max-w-2xl text-zinc-400">{copy}</p>}
    </div>
  )
}
