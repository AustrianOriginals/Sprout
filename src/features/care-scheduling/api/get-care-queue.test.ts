import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@shared/api/db'
import { createPlant } from '@entities/plant'
import type { CreatePlantInput } from '@entities/plant'
import { createCareEvent } from '@entities/care-event'
import { getWateringCareQueue } from './get-care-queue'

function buildPlantInput(overrides: Partial<CreatePlantInput> = {}): CreatePlantInput {
  return {
    name: 'Queue-Test-Pflanze',
    species: 'Testart',
    careCategory: 'tropical',
    sunlight: 'medium',
    size: 'medium',
    pot: { diameterCm: 12, heightCm: 12, material: 'plastic', hasDrainageHole: true },
    location: { type: 'indoor' },
    acquiredAt: new Date('2026-01-01'),
    ...overrides,
  }
}

beforeEach(async () => {
  await db.plants.clear()
  await db.careEvents.clear()
})

describe('getWateringCareQueue', () => {
  it('returns an empty array when there are no plants', async () => {
    expect(await getWateringCareQueue()).toEqual([])
  })

  it('sorts plants by due date, overdue first', async () => {
    const plantA = await createPlant(buildPlantInput({ name: 'Pflanze A' }))
    const plantB = await createPlant(buildPlantInput({ name: 'Pflanze B' }))

    // A: vor 20 Tagen gegossen -> deutlich überfällig (Basis 8 Tage)
    await createCareEvent({
      plantId: plantA.id,
      type: 'watering',
      performedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    })
    // B: heute gegossen -> erst in 8 Tagen fällig
    await createCareEvent({ plantId: plantB.id, type: 'watering', performedAt: new Date() })

    const queue = await getWateringCareQueue()
    expect(queue).toHaveLength(2)
    expect(queue[0].plantName).toBe('Pflanze A')
    expect(queue[0].status).toBe('overdue')
    expect(queue[1].plantName).toBe('Pflanze B')
    expect(queue[1].status).toBe('upcoming')
  })
})
