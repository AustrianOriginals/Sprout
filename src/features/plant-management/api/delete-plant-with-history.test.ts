import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@shared/api/db'
import { createPlant, getPlantById } from '@entities/plant'
import type { CreatePlantInput } from '@entities/plant'
import { createCareEvent, getCareEventsByPlantId } from '@entities/care-event'
import { deletePlantWithHistory } from './delete-plant-with-history'

const samplePlantInput: CreatePlantInput = {
  name: 'Delete-Test-Pflanze',
  species: 'Testart',
  careCategory: 'tropical',
  sunlight: 'medium',
  size: 'medium',
  pot: { diameterCm: 12, heightCm: 12, material: 'plastic', hasDrainageHole: true },
  location: { type: 'indoor' },
  acquiredAt: new Date('2026-01-01'),
}

beforeEach(async () => {
  await db.plants.clear()
  await db.careEvents.clear()
})

describe('deletePlantWithHistory', () => {
  it('deletes the plant and all its care events', async () => {
    const plant = await createPlant(samplePlantInput)
    await createCareEvent({ plantId: plant.id, type: 'watering', performedAt: new Date() })
    await createCareEvent({ plantId: plant.id, type: 'fertilizing', performedAt: new Date() })

    await deletePlantWithHistory(plant.id)

    expect(await getPlantById(plant.id)).toBeUndefined()
    expect(await getCareEventsByPlantId(plant.id)).toHaveLength(0)
  })
})
