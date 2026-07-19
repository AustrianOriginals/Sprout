import { Moon, Sun, Monitor } from 'lucide-react'
import { useThemeStore, type ThemeMode } from '@shared/model/theme-store'
import { Button } from '@shared/ui/button'

const MODES: ThemeMode[] = ['light', 'dark', 'system']

const MODE_ICONS = { light: Sun, dark: Moon, system: Monitor }

export function ThemeToggle() {
  const mode = useThemeStore((state) => state.mode)
  const setMode = useThemeStore((state) => state.setMode)

  function cycleMode() {
    const nextIndex = (MODES.indexOf(mode) + 1) % MODES.length
    setMode(MODES[nextIndex])
  }

  const Icon = MODE_ICONS[mode]

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleMode}
      aria-label={`Switch theme (current: ${mode})`}
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
}
