import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@app/App'
import '@app/index.css'
import '@shared/config/i18n'
import { initEncryptionKey } from '@shared/lib/crypto/encryption-key'

async function bootstrap() {
  await initEncryptionKey()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}

bootstrap()
