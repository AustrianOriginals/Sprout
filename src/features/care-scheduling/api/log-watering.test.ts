import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@shared/api/db'
import { createPlant } from '@entities/plant'
import type { CreatePlantInput } from '@entities/plant'
import { getCareEventsByPlantId } from '@entities/care-event'
import { logWatering } from './log-watering'
import { getNextWateringDateForPlant } from './get-next-watering-date'

const samplePlantInput: CreatePlantInput = {
  name: 'Log-Test-Pflanze',
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

describe('logWatering', () => {
  it('stores the previously expected date as scheduledFor', async () => {
    const plant = await createPlant(samplePlantInput)
    const expectedDueDate = await getNextWateringDateForPlant(plant.id)

    await logWatering(plant.id, new Date('2026-03-01'))

    const events = await getCareEventsByPlantId(plant.id)
    expect(events).toHaveLength(1)
    expect(events[0].performedAt).toEqual(new Date('2026-03-01'))
    expect(events[0].scheduledFor).toEqual(expectedDueDate)
  })

  it('shifts the next watering date forward after logging', async () => {
    const plant = await createPlant(samplePlantInput)
    await logWatering(plant.id, new Date('2026-03-01'))

    expect(await getNextWateringDateForPlant(plant.id)).toEqual(new Date('2026-03-02'))
  })
})
