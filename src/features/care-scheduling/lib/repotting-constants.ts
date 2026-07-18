import type { Plant } from '@entities/plant'

type CareCategory = Plant['careCategory']

export const BASE_REPOTTING_INTERVAL_DAYS: Record<CareCategory, number> = {
  tropical: 730,
  succulent: 1095,
  cactus: 1460,
  fern: 365,
  herb: 180,
  flowering: 365,
  other: 730,
}

// < 1.0 = kürzeres Intervall (große Pflanze wächst schneller aus dem Topf heraus)
export const PLANT_SIZE_REPOTTING_MODIFIERS: Record<Plant['size'], number> = {
  small: 1.3,
  medium: 1.0,
  large: 0.8,
}
