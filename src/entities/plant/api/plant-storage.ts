import { db } from '@shared/api/db'
import {
  encryptString,
  decryptString,
  type EncryptedField,
} from '@shared/lib/crypto/field-encryption'
import { plantSchema, type Plant, type CreatePlantInput } from '../model/schema'

type StoredPlant = Omit<Plant, 'name' | 'species' | 'notes'> & {
  name: EncryptedField
  species: EncryptedField
  notes: EncryptedField | undefined
}

export async function encryptPlant(plant: Plant): Promise<StoredPlant> {
  return {
    ...plant,
    name: await encryptString(plant.name),
    species: await encryptString(plant.species),
    notes: plant.notes !== undefined ? await encryptString(plant.notes) : undefined,
  }
}

async function decryptPlant(stored: StoredPlant): Promise<Plant> {
  return {
    ...stored,
    name: await decryptString(stored.name),
    species: await decryptString(stored.species),
    notes: stored.notes !== undefined ? await decryptString(stored.notes) : undefined,
  }
}

export async function getAllPlants(): Promise<Plant[]> {
  const stored = (await db.plants.toArray()) as unknown as StoredPlant[]
  return Promise.all(stored.map(decryptPlant))
}

export async function getPlantById(id: string): Promise<Plant | undefined> {
  const stored = (await db.plants.get(id)) as unknown as StoredPlant | undefined
  return stored ? decryptPlant(stored) : undefined
}

export async function createPlant(input: CreatePlantInput): Promise<Plant> {
  const now = new Date()
  const plant: Plant = { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now }
  const validated = plantSchema.parse(plant)
  const stored = await encryptPlant(validated)
  await db.plants.add(stored as unknown as Plant)
  return validated
}

export async function updatePlant(
  id: string,
  changes: Partial<Omit<Plant, 'id' | 'createdAt'>>
): Promise<Plant> {
  const existing = await getPlantById(id)
  if (!existing) {
    throw new Error(`Plant mit id ${id} nicht gefunden`)
  }
  const updated: Plant = { ...existing, ...changes, updatedAt: new Date() }
  const validated = plantSchema.parse(updated)
  const stored = await encryptPlant(validated)
  await db.plants.put(stored as unknown as Plant)
  return validated
}

export async function deletePlant(id: string): Promise<void> {
  await db.plants.delete(id)
}
