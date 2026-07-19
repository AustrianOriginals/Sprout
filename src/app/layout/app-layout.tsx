import { Link, Outlet } from 'react-router-dom'
import { useAppliedTheme } from '@shared/model/use-applied-theme'
import { ThemeToggle } from '@shared/ui/theme-toggle'

export function AppLayout() {
  useAppliedTheme()

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-md items-center justify-between gap-2 p-4">
          <Link to="/" className="flex items-center gap-2 font-serif text-lg font-semibold">
            <span aria-hidden>🌱</span>
            Sprout
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
