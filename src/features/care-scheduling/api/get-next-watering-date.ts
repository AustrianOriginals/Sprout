import { getPlantById } from '@entities/plant'
import { getCareEventsByPlantId } from '@entities/care-event'
import type { CareEvent } from '@entities/care-event'
import { calculateNextWateringDate } from '../lib/calculate-next-watering-date'

export async function getNextWateringDateForPlant(plantId: string): Promise<Date | null> {
  const plant = await getPlantById(plantId)
  if (!plant) {
    return null
  }

  const wateringEvents = (await getCareEventsByPlantId(plantId)).filter(
    (event) => event.type === 'watering'
  )

  // Fallback auf createdAt greift nur, falls eine Pflanze wider Erwarten ganz ohne
  // initiales Gieß-Event existiert (sollte durch den Anlege-Flow eigentlich nie vorkommen).
  const lastWateredAt = getMostRecentPerformedAt(wateringEvents) ?? plant.createdAt

  return calculateNextWateringDate(plant, wateringEvents, lastWateredAt)
}

function getMostRecentPerformedAt(events: CareEvent[]): Date | undefined {
  if (events.length === 0) return undefined
  return events.reduce((latest, event) => (event.performedAt > latest.performedAt ? event : latest))
    .performedAt
}
