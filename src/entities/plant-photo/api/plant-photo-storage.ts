import { db } from '@shared/api/db'
import { plantPhotoSchema, type PlantPhoto, type CreatePlantPhotoInput } from '../model/schema'

export async function getAllPlantPhotos(): Promise<PlantPhoto[]> {
  return db.plantPhotos.toArray()
}

export async function getPlantPhotoById(id: string): Promise<PlantPhoto | undefined> {
  return db.plantPhotos.get(id)
}

export async function getPhotosByPlantId(plantId: string): Promise<PlantPhoto[]> {
  return db.plantPhotos.where('plantId').equals(plantId).toArray()
}

export async function createPlantPhoto(input: CreatePlantPhotoInput): Promise<PlantPhoto> {
  const plantPhoto: PlantPhoto = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date(),
  }
  const validated = plantPhotoSchema.parse(plantPhoto)
  await db.plantPhotos.add(validated)
  return validated
}

export async function deletePlantPhoto(id: string): Promise<void> {
  await db.plantPhotos.delete(id)
}
