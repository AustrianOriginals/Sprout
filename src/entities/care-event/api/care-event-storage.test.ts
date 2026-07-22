import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@shared/api/db'
import {
  createCareEvent,
  getCareEventById,
  getCareEventsByPlantId,
  getAllCareEvents,
  deleteCareEvent,
} from './care-event-storage'
import type { CreateCareEventInput } from '../model/schema'

const samplePlantId = crypto.randomUUID()

const sampleCareEvent: CreateCareEventInput = {
  plantId: samplePlantId,
  type: 'watering',
  performedAt: new Date('2026-01-01'),
  note: 'Sample care event notes',
}

beforeEach(async () => {
  await db.careEvents.clear()
})

describe('care-event-storage', () => {
  it('creates and retrieves a care event', async () => {
    const created = await createCareEvent(sampleCareEvent)
    expect(created.id).toBeDefined()
    expect(created.type).toBe('watering')

    const fetched = await getCareEventById(created.id)
    expect(fetched).toEqual(created)
  })

  it('lists all care events', async () => {
    await createCareEvent(sampleCareEvent)
    await createCareEvent({ ...sampleCareEvent, type: 'fertilizing' })

    const all = await getAllCareEvents()
    expect(all).toHaveLength(2)
  })

  it('lists care events by plant ID', async () => {
    await createCareEvent(sampleCareEvent)
    await createCareEvent({ ...sampleCareEvent, plantId: crypto.randomUUID() })

    const eventsForSamplePlant = await getCareEventsByPlantId(samplePlantId)
    expect(eventsForSamplePlant).toHaveLength(1)
    expect(eventsForSamplePlant[0].type).toBe('watering')
  })

  it('deletes a care event', async () => {
    const created = await createCareEvent(sampleCareEvent)
    await deleteCareEvent(created.id)

    expect(await getCareEventById(created.id)).toBeUndefined()
  })

  it('rejects amountMl on non-watering events', async () => {
    const invalidEvent: CreateCareEventInput = {
      ...sampleCareEvent,
      type: 'fertilizing',
      amountMl: 200,
    }

    await expect(createCareEvent(invalidEvent)).rejects.toThrow()
  })

  it('stores note encrypted, not as plain text', async () => {
    const created = await createCareEvent({ ...sampleCareEvent, note: 'Geheime Notiz' })
    const rawRecord = await db.careEvents.get(created.id)

    expect(JSON.stringify(rawRecord?.note)).not.toContain('Geheime Notiz')
  })
})
