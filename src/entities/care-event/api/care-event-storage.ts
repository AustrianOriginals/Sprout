import { db } from '@shared/api/db'
import { careEventSchema, type CareEvent, type CreateCareEventInput } from '../model/schema'

export async function getAllCareEvents(): Promise<CareEvent[]> {
  return db.careEvents.toArray()
}

export async function getCareEventById(id: string): Promise<CareEvent | undefined> {
  return db.careEvents.get(id)
}

export async function getCareEventsByPlantId(plantId: string): Promise<CareEvent[]> {
  return db.careEvents.where('plantId').equals(plantId).toArray()
}

export async function createCareEvent(input: CreateCareEventInput): Promise<CareEvent> {
  const careEvent: CareEvent = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date(),
  }
  const validated = careEventSchema.parse(careEvent)
  await db.careEvents.add(validated)
  return validated
}

export async function deleteCareEvent(id: string): Promise<void> {
  await db.careEvents.delete(id)
}
