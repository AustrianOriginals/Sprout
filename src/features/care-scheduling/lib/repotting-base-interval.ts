import type { Plant } from '@entities/plant'
import { BASE_REPOTTING_INTERVAL_DAYS, PLANT_SIZE_REPOTTING_MODIFIERS } from './repotting-constants'
import { potVolumeModifier } from './pot-volume'

export function calculateBaseRepottingIntervalDays(plant: Plant): number {
  const base = BASE_REPOTTING_INTERVAL_DAYS[plant.careCategory]
  const adjusted = base * PLANT_SIZE_REPOTTING_MODIFIERS[plant.size] * potVolumeModifier(plant.pot)
  return Math.round(adjusted)
}
