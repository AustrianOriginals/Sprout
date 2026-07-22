import { useState, type FormEvent, type ReactNode } from 'react'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'

const STORAGE_KEY = 'sprout-site-unlocked'
const SITE_PASSWORD = import.meta.env.VITE_SITE_PASSWORD as string | undefined

type SiteGateProps = {
  children: ReactNode
}

export function SiteGate({ children }: SiteGateProps) {
  const [isUnlocked, setIsUnlocked] = useState(
    () => !SITE_PASSWORD || localStorage.getItem(STORAGE_KEY) === 'true'
  )
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (input === SITE_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'true')
      setIsUnlocked(true)
    } else {
      setError(true)
    }
  }

  if (isUnlocked) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4 text-foreground">
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4 text-center">
        <div className="space-y-1">
          <p className="text-2xl">🌱</p>
          <h1 className="font-serif text-xl">Sprout</h1>
          <p className="text-sm text-muted-foreground">
            This app is still under development. Enter the access code to continue.
          </p>
        </div>
        <Input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setError(false)
          }}
          placeholder="Access code"
          autoFocus
        />
        {error && <p className="text-sm text-destructive">Incorrect code.</p>}
        <Button type="submit" className="w-full">
          Continue
        </Button>
      </form>
    </div>
  )
}
