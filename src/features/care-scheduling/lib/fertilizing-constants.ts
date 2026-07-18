import type { Plant } from '@entities/plant'

type CareCategory = Plant['careCategory']

export const BASE_FERTILIZING_INTERVAL_DAYS: Record<CareCategory, number> = {
  tropical: 21,
  succulent: 60,
  cactus: 90,
  fern: 28,
  herb: 14,
  flowering: 14,
  other: 30,
}
