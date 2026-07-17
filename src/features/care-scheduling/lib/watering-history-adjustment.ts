import type { CareEvent } from '@entities/care-event'

const MOVING_AVERAGE_WINDOW = 3 // Anzahl der letzten Gieß-Events, die einfließen

export function calculateHistoryAdjustmentDays(wateringEvents: CareEvent[]): number {
  const recentDeviations = wateringEvents
    .filter((event) => event.scheduledFor !== undefined)
    .sort((a, b) => b.performedAt.getTime() - a.performedAt.getTime())
    .slice(0, MOVING_AVERAGE_WINDOW)
    .map((event) => {
      const deviationMs = event.performedAt.getTime() - event.scheduledFor!.getTime()
      return deviationMs / (1000 * 60 * 60 * 24)
    })

  if (recentDeviations.length === 0) {
    return 0
  }

  const average = recentDeviations.reduce((sum, d) => sum + d, 0) / recentDeviations.length
  return Math.round(average)
}
