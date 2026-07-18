import { getPlantById } from '@entities/plant'
import { getCareEventsByPlantId } from '@entities/care-event'
import { calculateNextRepottingDate } from '../lib/calculate-next-repotting-date'
import { getMostRecentPerformedAt } from '../lib/most-recent-event'

export async function getNextRepottingDateForPlant(plantId: string): Promise<Date | null> {
  const plant = await getPlantById(plantId)
  if (!plant) return null

  const repottingEvents = (await getCareEventsByPlantId(plantId)).filter(
    (event) => event.type === 'repotting'
  )
  const lastRepottedAt = getMostRecentPerformedAt(repottingEvents) ?? plant.createdAt

  return calculateNextRepottingDate(plant, lastRepottedAt)
}
