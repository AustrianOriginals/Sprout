import { db } from '@shared/api/db'

const KEY_ID = 'plant-data-encryption-key'

let cachedKeyPromise: Promise<CryptoKey> | null = null

async function loadOrCreateKey(): Promise<CryptoKey> {
  const existing = await db.encryptionKeys.get(KEY_ID)
  if (existing) {
    return existing.key
  }

  const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, [
    'encrypt',
    'decrypt',
  ])
  await db.encryptionKeys.put({ id: KEY_ID, key })
  return key
}

export async function getOrCreateEncryptionKey(): Promise<CryptoKey> {
  if (!cachedKeyPromise) {
    cachedKeyPromise = loadOrCreateKey()
  }
  return cachedKeyPromise
}

export async function initEncryptionKey(): Promise<void> {
  await getOrCreateEncryptionKey()
}
