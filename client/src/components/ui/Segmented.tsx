export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex overflow-hidden rounded-md border border-zinc-700">
      {options.map(o => (
        <button
          type="button"
          key={o}
          onClick={() => onChange(o)}
          className={`flex-1 px-2 py-2 font-mono text-xs transition ${
            value === o ? 'bg-blue-400/20 text-blue-200' : 'bg-zinc-950 text-zinc-400 hover:bg-zinc-900'
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  )
}
