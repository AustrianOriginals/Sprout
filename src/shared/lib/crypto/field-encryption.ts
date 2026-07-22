import { getOrCreateEncryptionKey } from './encryption-key'

export type EncryptedField = {
  iv: Uint8Array
  ciphertext: Uint8Array
}

export async function encryptString(value: string): Promise<EncryptedField> {
  const key = await getOrCreateEncryptionKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const plaintext = new TextEncoder().encode(value)
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv as BufferSource },
      key,
      plaintext as BufferSource
    )
  )
  return { iv, ciphertext }
}

export async function decryptString(field: EncryptedField): Promise<string> {
  const key = await getOrCreateEncryptionKey()

  console.log('[decrypt debug]', {
    iv: field.iv,
    ivIsUint8Array: field.iv instanceof Uint8Array,
    ivType: Object.prototype.toString.call(field.iv),
    ciphertext: field.ciphertext,
    ciphertextIsUint8Array: field.ciphertext instanceof Uint8Array,
    ciphertextType: Object.prototype.toString.call(field.ciphertext),
  })

  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: field.iv as BufferSource },
    key,
    field.ciphertext as BufferSource
  )
  return new TextDecoder().decode(plaintext)
}

export type EncryptedBlob = EncryptedField & { mimeType: string }

export async function encryptBlob(blob: Blob): Promise<EncryptedBlob> {
  const key = await getOrCreateEncryptionKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const plaintext = new Uint8Array(await blob.arrayBuffer())
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv as BufferSource },
      key,
      plaintext as BufferSource
    )
  )
  return { iv, ciphertext, mimeType: blob.type }
}

export async function decryptBlob(field: EncryptedBlob): Promise<Blob> {
  const key = await getOrCreateEncryptionKey()
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: field.iv as BufferSource },
    key,
    field.ciphertext as BufferSource
  )
  return new Blob([plaintext], { type: field.mimeType })
}
