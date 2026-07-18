import { describe, expect, it } from 'vitest'
import { calculateBaseFertilizingIntervalDays } from './fertilizing-base-interval'
import { buildPlant } from './test-utils'

describe('calculateBaseFertilizingIntervalDays', () => {
  it('uses the category base interval with a standard pot', () => {
    const plant = buildPlant() // tropical, 12x12 Topf → Modifikator ≈1.1536
    expect(calculateBaseFertilizingIntervalDays(plant)).toBe(24) // 21 × 1.1536 ≈ 24.2
  })

  it('uses a much longer base for cacti', () => {
    const plant = buildPlant({ careCategory: 'cactus' })
    expect(calculateBaseFertilizingIntervalDays(plant)).toBe(104) // 90 × 1.1536 ≈ 103.8
  })

  it('shortens the interval for a very small pot (clamped modifier)', () => {
    const plant = buildPlant({
      pot: { diameterCm: 3, heightCm: 3, material: 'plastic', hasDrainageHole: true },
    })
    expect(calculateBaseFertilizingIntervalDays(plant)).toBe(13) // 21 × 0.6 (geclamped) = 12.6
  })
})
