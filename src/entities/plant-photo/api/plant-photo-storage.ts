import { db } from '@shared/api/db'
import {
  encryptString,
  decryptString,
  encryptBlob,
  decryptBlob,
  type EncryptedField,
  type EncryptedBlob,
} from '@shared/lib/crypto/field-encryption'
import { plantPhotoSchema, type PlantPhoto, type CreatePlantPhotoInput } from '../model/schema'

type StoredPlantPhoto = Omit<PlantPhoto, 'image' | 'caption'> & {
  image: EncryptedBlob
  caption: EncryptedField | undefined
}

async function encryptPhoto(photo: PlantPhoto): Promise<StoredPlantPhoto> {
  return {
    ...photo,
    image: await encryptBlob(photo.image),
    caption: photo.caption !== undefined ? await encryptString(photo.caption) : undefined,
  }
}

async function decryptPhoto(stored: StoredPlantPhoto): Promise<PlantPhoto> {
  return {
    ...stored,
    image: await decryptBlob(stored.image),
    caption: stored.caption !== undefined ? await decryptString(stored.caption) : undefined,
  }
}

export async function getAllPlantPhotos(): Promise<PlantPhoto[]> {
  const stored = (await db.plantPhotos.toArray()) as unknown as StoredPlantPhoto[]
  return Promise.all(stored.map(decryptPhoto))
}

export async function getPlantPhotoById(id: string): Promise<PlantPhoto | undefined> {
  const stored = (await db.plantPhotos.get(id)) as unknown as StoredPlantPhoto | undefined
  return stored ? decryptPhoto(stored) : undefined
}

export async function getPhotosByPlantId(plantId: string): Promise<PlantPhoto[]> {
  const stored = (await db.plantPhotos
    .where('plantId')
    .equals(plantId)
    .toArray()) as unknown as StoredPlantPhoto[]
  return Promise.all(stored.map(decryptPhoto))
}

export async function createPlantPhoto(input: CreatePlantPhotoInput): Promise<PlantPhoto> {
  const plantPhoto: PlantPhoto = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date(),
  }
  const validated = plantPhotoSchema.parse(plantPhoto)
  const stored = await encryptPhoto(validated)
  await db.plantPhotos.add(stored as unknown as PlantPhoto)
  return validated
}

export async function deletePlantPhoto(id: string): Promise<void> {
  await db.plantPhotos.delete(id)
}
