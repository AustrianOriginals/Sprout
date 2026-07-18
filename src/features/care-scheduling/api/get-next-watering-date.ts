import { getPlantById } from '@entities/plant'
import { getCareEventsByPlantId } from '@entities/care-event'
import { getMostRecentPerformedAt } from '../lib/most-recent-event'
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
