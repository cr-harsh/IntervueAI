import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

export function Layout({
  children,
  flow = false,
  footer = true,
}: {
  children: ReactNode
  flow?: boolean
  footer?: boolean
}) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <div className="ambient -left-48 top-20" />
      <div className="ambient -right-48 bottom-0" />
      <Header flow={flow} />
      {children}
      {footer && <Footer />}
    </div>
  )
}
