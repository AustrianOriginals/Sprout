import { createCareEvent } from '@entities/care-event'

export async function logFertilizing(
  plantId: string,
  performedAt: Date = new Date()
): Promise<void> {
  await createCareEvent({ plantId, type: 'fertilizing', performedAt })
}
