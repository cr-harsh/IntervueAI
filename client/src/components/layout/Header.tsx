import { Link, useLocation } from 'react-router-dom'
import { Button } from '../ui/Button'

export function Header({ flow = false }: { flow?: boolean }) {
  const location = useLocation()
  const steps = [
    ['/setup', '01 Setup'],
    ['/questions', '02 Questions'],
    ['/interview', '03 Interview'],
    ['/results', '04 Results'],
  ]
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/90 bg-[#101011]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="font-display text-xl font-bold tracking-tight text-blue-200">IntervueAI</Link>
        {flow ? (
          <nav className="hidden gap-6 md:flex">
            {steps.map(([path, label]) => (
              <Link
                key={path}
                to={path}
                className={`border-b-2 pb-1 text-sm ${
                  location.pathname === path ? 'border-blue-300 font-semibold text-blue-200' : 'border-transparent text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        ) : (
          <nav className="hidden gap-5 text-sm text-zinc-400 md:flex">
            <a href="#how" className="hover:text-zinc-100">How It Works</a>
            <a href="#domains" className="hover:text-zinc-100">Domains</a>
          </nav>
        )}
        <Button to="/setup" className="px-3 py-2 text-xs">{flow ? 'New Session' : 'Get Started'}</Button>
      </div>
    </header>
  )
}
