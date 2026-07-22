import { Link, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart } from 'lucide-react'
import { useAppliedTheme } from '@shared/model/use-applied-theme'
import { ThemeToggle } from '@shared/ui/theme-toggle'
import { LanguageToggle } from '@shared/ui/language-toggle'
import { Button } from '@shared/ui/button'

export function AppLayout() {
  useAppliedTheme()
  const { t } = useTranslation()

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-md items-center justify-between gap-2 p-4">
          <Link to="/" className="flex items-center gap-2 font-serif text-lg font-semibold">
            <span aria-hidden>🌱</span>
            Sprout
          </Link>
          <div className="flex items-center gap-1">
            <Link to="/support">
              <Button variant="ghost" size="icon" aria-label={t('nav.support')}>
                <Heart className="h-4 w-4" />
              </Button>
            </Link>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
