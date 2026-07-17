import type { Plant } from '@entities/plant'
import type { CareEvent } from '@entities/care-event'
import { calculateBaseWateringIntervalDays } from './watering-base-interval'
import { calculateHistoryAdjustmentDays } from './watering-history-adjustment'

const MIN_INTERVAL_DAYS = 1

export function calculateNextWateringDate(
  plant: Plant,
  wateringHistory: CareEvent[],
  lastWateredAt: Date
): Date {
  const intervalDays =
    plant.careCycleOverride?.wateringDays ??
    Math.max(
      MIN_INTERVAL_DAYS,
      calculateBaseWateringIntervalDays(plant) + calculateHistoryAdjustmentDays(wateringHistory)
    )

  const nextDate = new Date(lastWateredAt)
  nextDate.setDate(nextDate.getDate() + intervalDays)
  return nextDate
}
