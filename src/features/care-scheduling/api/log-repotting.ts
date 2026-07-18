import { createCareEvent } from '@entities/care-event'

export async function logRepotting(plantId: string, performedAt: Date = new Date()): Promise<void> {
  await createCareEvent({ plantId, type: 'repotting', performedAt })
}
