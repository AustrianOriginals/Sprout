import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@shared/api/db'
import {
  createPlantPhoto,
  getPlantPhotoById,
  getPhotosByPlantId,
  getAllPlantPhotos,
  deletePlantPhoto,
} from './plant-photo-storage'
import type { CreatePlantPhotoInput } from '../model/schema'

const samplePlantId = crypto.randomUUID()

const samplePhoto: CreatePlantPhotoInput = {
  plantId: samplePlantId,
  image: new Blob(['fake-image-data'], { type: 'image/png' }),
  takenAt: new Date('2026-01-01'),
  caption: 'Erstes Foto',
}

beforeEach(async () => {
  await db.plantPhotos.clear()
})

describe('plant-photo-storage', () => {
  it('creates and retrieves a plant photo', async () => {
    const created = await createPlantPhoto(samplePhoto)
    expect(created.id).toBeDefined()
    expect(created.caption).toBe('Erstes Foto')

    const fetched = await getPlantPhotoById(created.id)
    expect(fetched?.id).toBe(created.id)
    expect(fetched?.image.size).toBe(created.image.size)
    expect(fetched?.image.type).toBe(created.image.type)
  })

  it('lists all plant photos', async () => {
    await createPlantPhoto(samplePhoto)
    await createPlantPhoto({ ...samplePhoto, caption: 'Zweites Foto' })

    const all = await getAllPlantPhotos()
    expect(all).toHaveLength(2)
  })

  it('lists photos by plant ID', async () => {
    await createPlantPhoto(samplePhoto)
    await createPlantPhoto({ ...samplePhoto, plantId: crypto.randomUUID() })

    const photosForSamplePlant = await getPhotosByPlantId(samplePlantId)
    expect(photosForSamplePlant).toHaveLength(1)
  })

  it('deletes a plant photo', async () => {
    const created = await createPlantPhoto(samplePhoto)
    await deletePlantPhoto(created.id)

    expect(await getPlantPhotoById(created.id)).toBeUndefined()
  })

  it('rejects photos larger than 5 MB', async () => {
    const oversizedBlob = new Blob([new Uint8Array(5 * 1024 * 1024 + 1)], {
      type: 'image/png',
    })
    const oversizedInput: CreatePlantPhotoInput = { ...samplePhoto, image: oversizedBlob }

    await expect(createPlantPhoto(oversizedInput)).rejects.toThrow()
  })

  it('stores caption and image encrypted, not as plain text/raw Blob', async () => {
    const created = await createPlantPhoto(samplePhoto)
    const rawRecord = await db.plantPhotos.get(created.id)

    expect(JSON.stringify(rawRecord?.caption)).not.toContain(samplePhoto.caption)
    expect(rawRecord?.image).not.toBeInstanceOf(Blob)
  })
})
