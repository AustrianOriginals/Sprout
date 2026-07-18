import type { CareEvent } from '@entities/care-event'

export function getMostRecentPerformedAt(events: CareEvent[]): Date | undefined {
  if (events.length === 0) return undefined
  return events.reduce((latest, event) => (event.performedAt > latest.performedAt ? event : latest))
    .performedAt
}
