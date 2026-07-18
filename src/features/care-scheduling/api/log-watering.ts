import { createCareEvent } from '@entities/care-event'
import { getNextWateringDateForPlant } from './get-next-watering-date'

export async function logWatering(plantId: string, performedAt: Date = new Date()): Promise<void> {
  const scheduledFor = (await getNextWateringDateForPlant(plantId)) ?? undefined

  await createCareEvent({
    plantId,
    type: 'watering',
    performedAt,
    scheduledFor,
  })
}
