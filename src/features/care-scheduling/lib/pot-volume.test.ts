import { describe, expect, it } from 'vitest'
import { estimateSoilVolumeCm3, potVolumeModifier } from './pot-volume'

describe('estimateSoilVolumeCm3', () => {
  it('calculates volume from diameter and height', () => {
    const volume = estimateSoilVolumeCm3({
      diameterCm: 12,
      heightCm: 12,
      material: 'plastic',
      hasDrainageHole: true,
    })
    expect(volume).toBeCloseTo(1153.59, 1)
  })

  it('falls back to diameter as height when heightCm is missing', () => {
    const withHeight = estimateSoilVolumeCm3({
      diameterCm: 10,
      heightCm: 10,
      material: 'plastic',
      hasDrainageHole: true,
    })
    const withoutHeight = estimateSoilVolumeCm3({
      diameterCm: 10,
      material: 'plastic',
      hasDrainageHole: true,
    })
    expect(withoutHeight).toBeCloseTo(withHeight, 5)
  })
})

describe('potVolumeModifier', () => {
  it('returns roughly 1.15 for a standard 12x12cm pot', () => {
    const modifier = potVolumeModifier({
      diameterCm: 12,
      heightCm: 12,
      material: 'plastic',
      hasDrainageHole: true,
    })
    expect(modifier).toBeCloseTo(1.15, 1)
  })

  it('clamps very small pots to the lower bound', () => {
    const modifier = potVolumeModifier({
      diameterCm: 3,
      heightCm: 3,
      material: 'plastic',
      hasDrainageHole: true,
    })
    expect(modifier).toBe(0.6)
  })

  it('clamps very large pots to the upper bound', () => {
    const modifier = potVolumeModifier({
      diameterCm: 100,
      heightCm: 100,
      material: 'ceramic',
      hasDrainageHole: true,
    })
    expect(modifier).toBe(1.6)
  })
})
