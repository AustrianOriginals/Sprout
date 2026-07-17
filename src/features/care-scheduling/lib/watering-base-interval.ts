import type { Plant } from '@entities/plant'
import {
  BASE_WATERING_INTERVAL_DAYS,
  SUNLIGHT_MODIFIERS,
  PLANT_SIZE_MODIFIERS,
} from './watering-constants'
import { potVolumeModifier } from './pot-volume'

export function calculateBaseWateringIntervalDays(plant: Plant): number {
  const base = BASE_WATERING_INTERVAL_DAYS[plant.careCategory]
  const adjusted =
    base *
    SUNLIGHT_MODIFIERS[plant.sunlight] *
    PLANT_SIZE_MODIFIERS[plant.size] *
    potVolumeModifier(plant.pot)

  return Math.round(adjusted)
}
