import { describe, expect, it } from 'vitest'
import { calculateBaseWateringIntervalDays } from './watering-base-interval'
import { buildPlant } from './test-utils'

describe('calculateBaseWateringIntervalDays', () => {
  it('uses the category base interval with default modifiers', () => {
    const plant = buildPlant() // tropical, medium/medium, 12x12 Topf
    expect(calculateBaseWateringIntervalDays(plant)).toBe(8)
  })

  it('shortens the interval for bright light, large plant, and small pot', () => {
    const plant = buildPlant({
      sunlight: 'bright_indirect',
      size: 'large',
      pot: { diameterCm: 10, heightCm: 10, material: 'plastic', hasDrainageHole: true },
    })
    expect(calculateBaseWateringIntervalDays(plant)).toBe(4)
  })

  it('uses a different base for succulents', () => {
    const plant = buildPlant({ careCategory: 'succulent' })
    expect(calculateBaseWateringIntervalDays(plant)).toBe(16)
  })
})
