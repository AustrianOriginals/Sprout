import { describe, expect, it } from 'vitest'
import { calculateHistoryAdjustmentDays } from './watering-history-adjustment'
import { buildCareEvent } from './test-utils'

describe('calculateHistoryAdjustmentDays', () => {
  it('returns 0 when there is no history', () => {
    expect(calculateHistoryAdjustmentDays([])).toBe(0)
  })

  it('returns 0 when events have no scheduledFor', () => {
    const event = buildCareEvent({ scheduledFor: undefined })
    expect(calculateHistoryAdjustmentDays([event])).toBe(0)
  })

  it('returns the deviation for a single event', () => {
    const event = buildCareEvent({
      scheduledFor: new Date('2026-01-01'),
      performedAt: new Date('2026-01-03'), // 2 Tage zu spät
    })
    expect(calculateHistoryAdjustmentDays([event])).toBe(2)
  })

  it('averages deviations across the moving window', () => {
    const events = [
      buildCareEvent({ scheduledFor: new Date('2026-01-01'), performedAt: new Date('2026-01-03') }), // +2
      buildCareEvent({ scheduledFor: new Date('2026-01-08'), performedAt: new Date('2026-01-07') }), // -1
      buildCareEvent({ scheduledFor: new Date('2026-01-15'), performedAt: new Date('2026-01-16') }), // +1
    ]
    // (2 + -1 + 1) / 3 = 0.667 → gerundet 1
    expect(calculateHistoryAdjustmentDays(events)).toBe(1)
  })

  it('only considers the most recent events within the window', () => {
    const withinWindow = [
      buildCareEvent({ scheduledFor: new Date('2026-01-01'), performedAt: new Date('2026-01-03') }),
      buildCareEvent({ scheduledFor: new Date('2026-01-08'), performedAt: new Date('2026-01-07') }),
      buildCareEvent({ scheduledFor: new Date('2026-01-15'), performedAt: new Date('2026-01-16') }),
    ]
    const olderOutlier = buildCareEvent({
      scheduledFor: new Date('2025-12-20'),
      performedAt: new Date('2025-12-25'), // +5, aber das älteste Event
    })

    const withoutOutlier = calculateHistoryAdjustmentDays(withinWindow)
    const withOutlier = calculateHistoryAdjustmentDays([...withinWindow, olderOutlier])

    expect(withOutlier).toBe(withoutOutlier)
  })
})
