import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@shared/api/db'
import { createPlant } from '@entities/plant'
import type { CreatePlantInput } from '@entities/plant'
import { createCareEvent } from '@entities/care-event'
import { getNextFertilizingDateForPlant } from './get-next-fertilizing-date'
import { calculateNextFertilizingDate } from '../lib/calculate-next-fertilizing-date'

const samplePlantInput: CreatePlantInput = {
  name: 'Fertilizing-Test-Pflanze',
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

describe('getNextFertilizingDateForPlant', () => {
  it('returns null for a non-existent plant', async () => {
    expect(await getNextFertilizingDateForPlant(crypto.randomUUID())).toBeNull()
  })

  it('uses the most recent fertilizing event and ignores watering events', async () => {
    const plant = await createPlant(samplePlantInput)
    await createCareEvent({
      plantId: plant.id,
      type: 'watering',
      performedAt: new Date('2026-02-05'),
    })
    await createCareEvent({
      plantId: plant.id,
      type: 'fertilizing',
      performedAt: new Date('2026-02-01'),
    })

    const expected = calculateNextFertilizingDate(plant, new Date('2026-02-01'))
    expect(await getNextFertilizingDateForPlant(plant.id)).toEqual(expected)
  })

  it('falls back to createdAt when there is no fertilizing history', async () => {
    const plant = await createPlant(samplePlantInput)
    const expected = calculateNextFertilizingDate(plant, plant.createdAt)

    expect(await getNextFertilizingDateForPlant(plant.id)).toEqual(expected)
  })
})
