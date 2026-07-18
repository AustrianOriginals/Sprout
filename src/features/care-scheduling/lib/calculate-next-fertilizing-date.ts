import type { Plant } from '@entities/plant'
import { calculateBaseFertilizingIntervalDays } from './fertilizing-base-interval'

const MIN_INTERVAL_DAYS = 7 // öfter als wöchentlich düngen ist bei fast keiner Pflanze sinnvoll

export function calculateNextFertilizingDate(plant: Plant, lastFertilizedAt: Date): Date {
  const intervalDays =
    plant.careCycleOverride?.fertilizingDays ??
    Math.max(MIN_INTERVAL_DAYS, calculateBaseFertilizingIntervalDays(plant))

  const nextDate = new Date(lastFertilizedAt)
  nextDate.setDate(nextDate.getDate() + intervalDays)
  return nextDate
}
