import { getPlantById } from '@entities/plant'
import { getCareEventsByPlantId } from '@entities/care-event'
import { calculateNextFertilizingDate } from '../lib/calculate-next-fertilizing-date'
import { getMostRecentPerformedAt } from '../lib/most-recent-event'

export async function getNextFertilizingDateForPlant(plantId: string): Promise<Date | null> {
  const plant = await getPlantById(plantId)
  if (!plant) return null

  const fertilizingEvents = (await getCareEventsByPlantId(plantId)).filter(
    (event) => event.type === 'fertilizing'
  )
  const lastFertilizedAt = getMostRecentPerformedAt(fertilizingEvents) ?? plant.createdAt

  return calculateNextFertilizingDate(plant, lastFertilizedAt)
}
