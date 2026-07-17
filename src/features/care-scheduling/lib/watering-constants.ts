import type { Plant } from '@entities/plant'

type CareCategory = Plant['careCategory']
type SunlightExposure = Plant['sunlight']
type PlantSize = Plant['size']

export const BASE_WATERING_INTERVAL_DAYS: Record<CareCategory, number> = {
  tropical: 7,
  succulent: 14,
  cactus: 21,
  fern: 5,
  herb: 4,
  flowering: 6,
  other: 7,
}

export const SUNLIGHT_MODIFIERS: Record<SunlightExposure, number> = {
  low: 1.15,
  medium: 1.0,
  bright_indirect: 0.9,
  direct: 0.8,
}

export const PLANT_SIZE_MODIFIERS: Record<PlantSize, number> = {
  small: 1.1,
  medium: 1.0,
  large: 0.85,
}
