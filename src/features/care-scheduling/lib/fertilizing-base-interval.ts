import type { Plant } from '@entities/plant'
import { BASE_FERTILIZING_INTERVAL_DAYS } from './fertilizing-constants'
import { potVolumeModifier } from './pot-volume'

export function calculateBaseFertilizingIntervalDays(plant: Plant): number {
  const base = BASE_FERTILIZING_INTERVAL_DAYS[plant.careCategory]
  return Math.round(base * potVolumeModifier(plant.pot))
}
