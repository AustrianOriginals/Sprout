import { db } from '@shared/api/db'
import {
  encryptString,
  decryptString,
  type EncryptedField,
} from '@shared/lib/crypto/field-encryption'
import { careEventSchema, type CareEvent, type CreateCareEventInput } from '../model/schema'

type StoredCareEvent = Omit<CareEvent, 'note'> & {
  note: EncryptedField | undefined
}

export async function encryptCareEvent(event: CareEvent): Promise<StoredCareEvent> {
  return {
    ...event,
    note: event.note !== undefined ? await encryptString(event.note) : undefined,
  }
}

async function decryptCareEvent(stored: StoredCareEvent): Promise<CareEvent> {
  return {
    ...stored,
    note: stored.note !== undefined ? await decryptString(stored.note) : undefined,
  }
}

export async function getAllCareEvents(): Promise<CareEvent[]> {
  const stored = (await db.careEvents.toArray()) as unknown as StoredCareEvent[]
  return Promise.all(stored.map(decryptCareEvent))
}

export async function getCareEventById(id: string): Promise<CareEvent | undefined> {
  const stored = (await db.careEvents.get(id)) as unknown as StoredCareEvent | undefined
  return stored ? decryptCareEvent(stored) : undefined
}

export async function getCareEventsByPlantId(plantId: string): Promise<CareEvent[]> {
  const stored = (await db.careEvents
    .where('plantId')
    .equals(plantId)
    .toArray()) as unknown as StoredCareEvent[]
  return Promise.all(stored.map(decryptCareEvent))
}

export async function createCareEvent(input: CreateCareEventInput): Promise<CareEvent> {
  const careEvent: CareEvent = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date(),
  }
  const validated = careEventSchema.parse(careEvent)
  const stored = await encryptCareEvent(validated)
  await db.careEvents.add(stored as unknown as CareEvent)
  return validated
}

export async function deleteCareEvent(id: string): Promise<void> {
  await db.careEvents.delete(id)
}
