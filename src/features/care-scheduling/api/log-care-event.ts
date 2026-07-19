import type { CareEventType } from '@entities/care-event'
import { logWatering } from './log-watering'
import { logFertilizing } from './log-fertilizing'
import { logRepotting } from './log-repotting'

const LOG_HANDLERS: Record<CareEventType, (plantId: string, performedAt?: Date) => Promise<void>> =
  {
    watering: logWatering,
    fertilizing: logFertilizing,
    repotting: logRepotting,
  }

export async function logCareEvent(
  type: CareEventType,
  plantId: string,
  performedAt: Date = new Date()
): Promise<void> {
  await LOG_HANDLERS[type](plantId, performedAt)
}
