import { describe, expect, it } from 'vitest'
import { calculateNextRepottingDate } from './calculate-next-repotting-date'
import { calculateBaseRepottingIntervalDays } from './repotting-base-interval'
import { buildPlant } from './test-utils'

describe('calculateNextRepottingDate', () => {
  it('adds the base interval to the last repotted date', () => {
    const plant = buildPlant()
    const lastRepottedAt = new Date('2024-01-01')

    const expected = new Date(lastRepottedAt)
    expected.setDate(expected.getDate() + calculateBaseRepottingIntervalDays(plant))

    expect(calculateNextRepottingDate(plant, lastRepottedAt)).toEqual(expected)
  })

  it('respects a custom cycle override', () => {
    const plant = buildPlant({ careCycleOverride: { repottingDays: 365 } })
    const lastRepottedAt = new Date('2026-01-01')

    const expected = new Date(lastRepottedAt)
    expected.setDate(expected.getDate() + 365)

    expect(calculateNextRepottingDate(plant, lastRepottedAt)).toEqual(expected)
  })

  it('enforces the minimum interval for an extreme small-pot, large-plant combination', () => {
    const plant = buildPlant({
      careCategory: 'herb',
      size: 'large',
      pot: { diameterCm: 3, heightCm: 3, material: 'plastic', hasDrainageHole: true },
    })
    const lastRepottedAt = new Date('2026-01-01')

    const baseInterval = calculateBaseRepottingIntervalDays(plant)
    expect(baseInterval).toBeLessThan(90) // Voraussetzung, damit dieser Test überhaupt aussagekräftig ist

    const expected = new Date(lastRepottedAt)
    expected.setDate(expected.getDate() + 90) // MIN_INTERVAL_DAYS greift statt der berechneten ~86 Tage

    expect(calculateNextRepottingDate(plant, lastRepottedAt)).toEqual(expected)
  })
})
