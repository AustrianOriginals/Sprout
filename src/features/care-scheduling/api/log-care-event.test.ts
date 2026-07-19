import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@shared/api/db'
import { createPlant } from '@entities/plant'
import type { CreatePlantInput } from '@entities/plant'
import { getCareEventsByPlantId } from '@entities/care-event'
import { logCareEvent } from './log-care-event'

const samplePlantInput: CreatePlantInput = {
  name: 'Dispatch-Test-Pflanze',
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

describe('logCareEvent', () => {
  it.each(['watering', 'fertilizing', 'repotting'] as const)(
    'creates a %s event via the dispatcher',
    async (type) => {
      const plant = await createPlant(samplePlantInput)
      await logCareEvent(type, plant.id, new Date('2026-03-01'))

      const events = (await getCareEventsByPlantId(plant.id)).filter((e) => e.type === type)
      expect(events).toHaveLength(1)
      expect(events[0].performedAt).toEqual(new Date('2026-03-01'))
    }
  )
})
