import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@shared/api/db'
import { createPlant } from '@entities/plant'
import type { CreatePlantInput } from '@entities/plant'
import { createCareEvent } from '@entities/care-event'
import { getNextRepottingDateForPlant } from './get-next-repotting-date'
import { calculateNextRepottingDate } from '../lib/calculate-next-repotting-date'

const samplePlantInput: CreatePlantInput = {
  name: 'Repotting-Test-Pflanze',
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

describe('getNextRepottingDateForPlant', () => {
  it('returns null for a non-existent plant', async () => {
    expect(await getNextRepottingDateForPlant(crypto.randomUUID())).toBeNull()
  })

  it('uses the most recent repotting event', async () => {
    const plant = await createPlant(samplePlantInput)
    await createCareEvent({
      plantId: plant.id,
      type: 'repotting',
      performedAt: new Date('2024-01-01'),
    })

    const expected = calculateNextRepottingDate(plant, new Date('2024-01-01'))
    expect(await getNextRepottingDateForPlant(plant.id)).toEqual(expected)
  })

  it('falls back to createdAt when there is no repotting history', async () => {
    const plant = await createPlant(samplePlantInput)
    const expected = calculateNextRepottingDate(plant, plant.createdAt)

    expect(await getNextRepottingDateForPlant(plant.id)).toEqual(expected)
  })
})
