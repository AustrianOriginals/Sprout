import { AppRouter } from './providers/router'
import { SiteGate } from './providers/site-gate'

export function App() {
  return (
    <SiteGate>
      <AppRouter />
    </SiteGate>
  )
}
