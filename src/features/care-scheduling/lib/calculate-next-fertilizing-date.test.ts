import { describe, expect, it } from 'vitest'
import { calculateNextFertilizingDate } from './calculate-next-fertilizing-date'
import { calculateBaseFertilizingIntervalDays } from './fertilizing-base-interval'
import { buildPlant } from './test-utils'

describe('calculateNextFertilizingDate', () => {
  it('adds the base interval to the last fertilized date', () => {
    const plant = buildPlant()
    const lastFertilizedAt = new Date('2026-01-01')

    const expected = new Date(lastFertilizedAt)
    expected.setDate(expected.getDate() + calculateBaseFertilizingIntervalDays(plant))

    expect(calculateNextFertilizingDate(plant, lastFertilizedAt)).toEqual(expected)
  })

  it('respects a custom cycle override, ignoring the algorithm entirely', () => {
    const plant = buildPlant({ careCycleOverride: { fertilizingDays: 10 } })
    const lastFertilizedAt = new Date('2026-01-01')

    const expected = new Date(lastFertilizedAt)
    expected.setDate(expected.getDate() + 10)

    expect(calculateNextFertilizingDate(plant, lastFertilizedAt)).toEqual(expected)
  })
})
