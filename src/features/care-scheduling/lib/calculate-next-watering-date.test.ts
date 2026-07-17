import { describe, expect, it } from 'vitest'
import { calculateNextWateringDate } from './calculate-next-watering-date'
import { buildPlant, buildCareEvent } from './test-utils'

describe('calculateNextWateringDate', () => {
  it('uses base interval when there is no history', () => {
    const plant = buildPlant() // Basisintervall = 8 Tage
    const next = calculateNextWateringDate(plant, [], new Date('2026-02-01'))
    expect(next).toEqual(new Date('2026-02-09'))
  })

  it('respects a custom cycle override, ignoring base and history', () => {
    const plant = buildPlant({ careCycleOverride: { wateringDays: 5 } })
    const history = [
      buildCareEvent({ scheduledFor: new Date('2026-01-01'), performedAt: new Date('2026-01-10') }),
    ]
    const next = calculateNextWateringDate(plant, history, new Date('2026-02-01'))
    expect(next).toEqual(new Date('2026-02-06'))
  })

  it('adjusts the interval based on watering history', () => {
    const plant = buildPlant() // Basis 8 Tage
    const history = [
      buildCareEvent({ scheduledFor: new Date('2026-01-01'), performedAt: new Date('2026-01-03') }), // +2
      buildCareEvent({ scheduledFor: new Date('2026-01-08'), performedAt: new Date('2026-01-07') }), // -1
      buildCareEvent({ scheduledFor: new Date('2026-01-15'), performedAt: new Date('2026-01-16') }), // +1
    ]
    // Basis 8 + Anpassung 1 = 9 Tage
    const next = calculateNextWateringDate(plant, history, new Date('2026-02-01'))
    expect(next).toEqual(new Date('2026-02-10'))
  })

  it('never produces an interval shorter than the minimum', () => {
    const plant = buildPlant() // Basis 8 Tage
    const history = [
      buildCareEvent({ scheduledFor: new Date('2026-01-20'), performedAt: new Date('2026-01-01') }), // 19 Tage zu früh
    ]
    // Basis 8 + Anpassung -19 = -11 → geclamped auf Minimum 1
    const next = calculateNextWateringDate(plant, history, new Date('2026-02-01'))
    expect(next).toEqual(new Date('2026-02-02'))
  })
})
