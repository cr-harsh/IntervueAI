import type { ReactNode } from 'react'

export function Badge({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <span className={`inline-flex rounded border px-2 py-0.5 font-mono text-[11px] ${className}`}>{children}</span>
}