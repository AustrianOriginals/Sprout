import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@shared/api/db'
import { createPlant } from '@entities/plant'
import type { CreatePlantInput } from '@entities/plant'
import { createCareEvent } from '@entities/care-event'
import { getCareQueue } from './get-care-queue'

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

describe('getCareQueue', () => {
  it('returns an empty array when there are no plants', async () => {
    expect(await getCareQueue()).toEqual([])
  })

  it('includes all three care types for a single plant', async () => {
    const plant = await createPlant(buildPlantInput())

    const queue = await getCareQueue()
    const types = queue.filter((item) => item.plantId === plant.id).map((item) => item.type)

    expect(types).toHaveLength(3)
    expect(types).toEqual(expect.arrayContaining(['watering', 'fertilizing', 'repotting']))
  })

  it('sorts entries across plants and care types by due date', async () => {
    const plantA = await createPlant(buildPlantInput({ name: 'Pflanze A' }))
    const plantB = await createPlant(buildPlantInput({ name: 'Pflanze B' }))

    // A: Gießen ist längst überfällig
    await createCareEvent({
      plantId: plantA.id,
      type: 'watering',
      performedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    })
    // B: gerade erst gegossen, noch lange nicht fällig
    await createCareEvent({ plantId: plantB.id, type: 'watering', performedAt: new Date() })

    const queue = await getCareQueue()
    expect(queue[0].plantName).toBe('Pflanze A')
    expect(queue[0].type).toBe('watering')
    expect(queue[0].status).toBe('overdue')
  })
})
