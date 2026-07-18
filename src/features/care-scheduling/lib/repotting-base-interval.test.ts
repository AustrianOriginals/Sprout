import { describe, expect, it } from 'vitest'
import { calculateBaseRepottingIntervalDays } from './repotting-base-interval'
import { buildPlant } from './test-utils'

describe('calculateBaseRepottingIntervalDays', () => {
  it('uses the category base interval for a medium plant', () => {
    const plant = buildPlant() // tropical, medium, 12x12 Topf
    expect(calculateBaseRepottingIntervalDays(plant)).toBe(842) // 730 × 1.0 × 1.1536 ≈ 842.1
  })

  it('shortens the interval for a large plant', () => {
    const plant = buildPlant({ size: 'large' })
    expect(calculateBaseRepottingIntervalDays(plant)).toBe(674) // 730 × 0.8 × 1.1536 ≈ 673.7
  })

  it('lengthens the interval for a small plant', () => {
    const plant = buildPlant({ size: 'small' })
    expect(calculateBaseRepottingIntervalDays(plant)).toBe(1095) // 730 × 1.3 × 1.1536 ≈ 1094.8
  })
})
