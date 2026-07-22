import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@shared/api/db'
import { createPlant, getAllPlants, getPlantById, updatePlant, deletePlant } from './plant-storage'
import type { CreatePlantInput } from '../model/schema'

const samplePlant: CreatePlantInput = {
  name: 'Testpflanze',
  species: 'Monstera Deliciosa',
  careCategory: 'tropical',
  sunlight: 'bright_indirect',
  size: 'medium',
  pot: { diameterCm: 12, material: 'plastic', hasDrainageHole: true },
  location: { type: 'indoor' },
  acquiredAt: new Date('2026-01-01'),
}

beforeEach(async () => {
  await db.plants.clear()
})

describe('plant-storage', () => {
  it('creates and retrieves a plant', async () => {
    const created = await createPlant(samplePlant)
    expect(created.id).toBeDefined()
    expect(created.name).toBe('Testpflanze')

    const fetched = await getPlantById(created.id)
    expect(fetched).toEqual(created)
  })

  it('lists all plants', async () => {
    await createPlant(samplePlant)
    await createPlant({ ...samplePlant, name: 'Zweite Pflanze' })

    const all = await getAllPlants()
    expect(all).toHaveLength(2)
  })

  it('updates a plant and bumps updatedAt', async () => {
    const created = await createPlant(samplePlant)
    await new Promise((resolve) => setTimeout(resolve, 5))

    const updated = await updatePlant(created.id, { name: 'Umbenannt' })
    expect(updated.name).toBe('Umbenannt')
    expect(updated.updatedAt.getTime()).toBeGreaterThan(created.updatedAt.getTime())
  })

  it('throws when updating a non-existent plant', async () => {
    await expect(updatePlant('nonexistent-id', { name: 'x' })).rejects.toThrow()
  })

  it('deletes a plant', async () => {
    const created = await createPlant(samplePlant)
    await deletePlant(created.id)

    expect(await getPlantById(created.id)).toBeUndefined()
  })

  it('rejects invalid data via Zod validation', async () => {
    const invalidInput = { ...samplePlant, name: '' }
    await expect(createPlant(invalidInput as CreatePlantInput)).rejects.toThrow()
  })

  it('stores name and species encrypted, not as plain text', async () => {
    const created = await createPlant(samplePlant)

    const rawRecord = await db.plants.get(created.id)
    const rawJson = JSON.stringify(rawRecord)

    expect(rawJson).not.toContain(samplePlant.name)
    expect(rawJson).not.toContain(samplePlant.species)
  })
})
