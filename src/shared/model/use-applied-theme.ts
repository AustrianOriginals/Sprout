import { useEffect } from 'react'
import { useThemeStore, type ThemeMode } from './theme-store'

function resolveIsDark(mode: ThemeMode): boolean {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return mode === 'dark'
}

export function useAppliedTheme(): void {
  const mode = useThemeStore((state) => state.mode)

  useEffect(() => {
    const root = document.documentElement
    const applyTheme = () => root.classList.toggle('dark', resolveIsDark(mode))

    applyTheme()

    if (mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', applyTheme)
      return () => mediaQuery.removeEventListener('change', applyTheme)
    }
  }, [mode])
}
