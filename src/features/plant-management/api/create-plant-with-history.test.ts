import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@shared/api/db'
import { getPlantById } from '@entities/plant'
import { getCareEventsByPlantId } from '@entities/care-event'
import { createPlantWithInitialWatering } from './create-plant-with-history'
import type { CreatePlantFormValues } from '../model/create-plant-form-schema'

const sampleInput: CreatePlantFormValues = {
  name: 'Verschlüsselungstest',
  species: 'Testart',
  careCategory: 'tropical',
  sunlight: 'medium',
  size: 'medium',
  pot: { diameterCm: 12, material: 'plastic', hasDrainageHole: true },
  location: { type: 'indoor' },
  acquiredAt: new Date('2026-01-01'),
  lastWateredAt: new Date('2026-01-01'),
}

beforeEach(async () => {
  await db.plants.clear()
  await db.careEvents.clear()
})

describe('createPlantWithInitialWatering', () => {
  it('stores name and species encrypted, not as plain text', async () => {
    const created = await createPlantWithInitialWatering(sampleInput)
    const rawRecord = await db.plants.get(created.id)

    expect(JSON.stringify(rawRecord)).not.toContain('Verschlüsselungstest')
    expect(JSON.stringify(rawRecord)).not.toContain('Testart')
  })

  it('can be read back and decrypted correctly via getPlantById', async () => {
    const created = await createPlantWithInitialWatering(sampleInput)
    const fetched = await getPlantById(created.id)

    expect(fetched?.name).toBe('Verschlüsselungstest')
    expect(fetched?.species).toBe('Testart')
  })

  it('creates exactly one initial watering event', async () => {
    const created = await createPlantWithInitialWatering(sampleInput)
    const events = await getCareEventsByPlantId(created.id)

    expect(events).toHaveLength(1)
    expect(events[0].type).toBe('watering')
  })
})
