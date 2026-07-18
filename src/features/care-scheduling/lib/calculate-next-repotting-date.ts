import type { Plant } from '@entities/plant'
import { calculateBaseRepottingIntervalDays } from './repotting-base-interval'

const MIN_INTERVAL_DAYS = 90 // Umtopfen öfter als vierteljährlich ist untypisch/schädlich

export function calculateNextRepottingDate(plant: Plant, lastRepottedAt: Date): Date {
  const intervalDays =
    plant.careCycleOverride?.repottingDays ??
    Math.max(MIN_INTERVAL_DAYS, calculateBaseRepottingIntervalDays(plant))

  const nextDate = new Date(lastRepottedAt)
  nextDate.setDate(nextDate.getDate() + intervalDays)
  return nextDate
}
