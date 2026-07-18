import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@shared/api/db'
import { createPlant } from '@entities/plant'
import type { CreatePlantInput } from '@entities/plant'
import { createCareEvent } from '@entities/care-event'
import { getNextWateringDateForPlant } from './get-next-watering-date'

const samplePlantInput: CreatePlantInput = {
  name: 'Integrationstest-Pflanze',
  species: 'Monstera Deliciosa',
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

describe('getNextWateringDateForPlant', () => {
  it('returns null for a non-existent plant', async () => {
    expect(await getNextWateringDateForPlant(crypto.randomUUID())).toBeNull()
  })

  it('calculates the next date from the most recent watering event', async () => {
    const plant = await createPlant(samplePlantInput)
    await createCareEvent({
      plantId: plant.id,
      type: 'watering',
      performedAt: new Date('2026-02-01'),
    })

    // Basisintervall tropical/medium/medium/12x12 = 8 Tage
    expect(await getNextWateringDateForPlant(plant.id)).toEqual(new Date('2026-02-09'))
  })

  it('uses the most recent of multiple watering events, not the first', async () => {
    const plant = await createPlant(samplePlantInput)
    await createCareEvent({
      plantId: plant.id,
      type: 'watering',
      performedAt: new Date('2026-01-15'),
    })
    await createCareEvent({
      plantId: plant.id,
      type: 'watering',
      performedAt: new Date('2026-02-01'),
    })

    expect(await getNextWateringDateForPlant(plant.id)).toEqual(new Date('2026-02-09'))
  })

  it('falls back to createdAt when no watering events exist', async () => {
    const plant = await createPlant(samplePlantInput)
    const expected = new Date(plant.createdAt)
    expected.setDate(expected.getDate() + 8)

    expect(await getNextWateringDateForPlant(plant.id)).toEqual(expected)
  })

  it('ignores non-watering events when calculating the watering date', async () => {
    const plant = await createPlant(samplePlantInput)
    await createCareEvent({
      plantId: plant.id,
      type: 'fertilizing',
      performedAt: new Date('2026-02-05'),
    })
    const expected = new Date(plant.createdAt)
    expected.setDate(expected.getDate() + 8)

    expect(await getNextWateringDateForPlant(plant.id)).toEqual(expected)
  })
})
