import { db } from '@shared/api/db'
import { plantSchema, type Plant, type CreatePlantInput } from '../model/schema'

export async function getAllPlants(): Promise<Plant[]> {
  return db.plants.toArray()
}

export async function getPlantById(id: string): Promise<Plant | undefined> {
  return db.plants.get(id)
}

export async function createPlant(input: CreatePlantInput): Promise<Plant> {
  const now = new Date()
  const plant: Plant = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  }
  const validated = plantSchema.parse(plant)
  await db.plants.add(validated)
  return validated
}

export async function updatePlant(
  id: string,
  changes: Partial<Omit<Plant, 'id' | 'createdAt'>>
): Promise<Plant> {
  const existing = await db.plants.get(id)
  if (!existing) {
    throw new Error(`Plant mit id ${id} nicht gefunden`)
  }
  const updated: Plant = { ...existing, ...changes, updatedAt: new Date() }
  const validated = plantSchema.parse(updated)
  await db.plants.put(validated)
  return validated
}

export async function deletePlant(id: string): Promise<void> {
  await db.plants.delete(id)
}
