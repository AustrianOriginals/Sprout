import { Link, Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-md items-center gap-2 p-4">
          <Link to="/" className="flex items-center gap-2 font-serif text-lg font-semibold">
            <span aria-hidden>🌱</span>
            Sprout
          </Link>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
