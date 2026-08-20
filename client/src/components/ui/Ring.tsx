export function Ring({
  value,
  label,
  color = '#a5b4fc',
  small = false,
}: {
  value: number
  label: string
  color?: string
  small?: boolean
}) {
  const r = small ? 36 : 44
  const circumference = 2 * Math.PI * r
  return (
    <div className="text-center">
      <svg className={`-rotate-90 ${small ? 'h-16 w-16' : 'h-44 w-44'}`} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#27272a" strokeWidth={small ? 9 : 8} />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={small ? 9 : 8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value / 100)}
        />
      </svg>
      <div className={`-mt-${small ? '10' : '25'} relative font-mono ${small ? 'text-xs' : 'text-4xl'} font-semibold`} style={{ color }}>
        {value}{small ? '%' : ''}
      </div>
      {!small && <div className="mt-2 font-mono text-xs text-zinc-500">/ 100</div>}
      <div className={small ? 'mt-8 font-mono text-[11px] text-zinc-200' : ''}>{small && label}</div>
    </div>
  )
}
