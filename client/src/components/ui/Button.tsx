import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function Button({
    children, to, onClick, variant = 'primary', disabled = false, className = '', type = 'button',
}: {
    children: ReactNode; to?: string; onClick?: () => void
    variant?: 'primary' | 'secondary' | 'ghost'; disabled?: boolean; className?: string
    type?: 'button' | 'submit'
}) {
    const style =
        variant === 'primary'
            ? 'bg-blue-500 text-white hover:bg-blue-400 shadow-[0_0_18px_rgba(59,130,246,.28)]'
            : variant === 'secondary'
                ? 'border border-zinc-700 bg-zinc-950 text-zinc-100 hover:bg-zinc-900'
                : 'text-zinc-400 hover:text-zinc-100'
    const base = `inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 font-mono text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${style} ${className}`
    return to ? (
        <Link to={to} className={base}>{children}</Link>
    ) : (
        <button type={type} className={base} disabled={disabled} onClick={onClick}>{children}</button>
    )
}