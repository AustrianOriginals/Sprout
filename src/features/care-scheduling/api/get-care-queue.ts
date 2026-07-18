import { getAllPlants } from '@entities/plant'
import { getCareStatus, daysUntil, type CareStatus } from '../lib/care-status'
import { getNextWateringDateForPlant } from './get-next-watering-date'

export type CareQueueItem = {
  plantId: string
  plantName: string
  dueDate: Date
  status: CareStatus
  daysUntil: number
}

export async function getWateringCareQueue(): Promise<CareQueueItem[]> {
  const plants = await getAllPlants()

  const items = await Promise.all(
    plants.map(async (plant): Promise<CareQueueItem | null> => {
      const dueDate = await getNextWateringDateForPlant(plant.id)
      if (!dueDate) return null

      return {
        plantId: plant.id,
        plantName: plant.name,
        dueDate,
        status: getCareStatus(dueDate),
        daysUntil: daysUntil(dueDate),
      }
    })
  )

  return items
    .filter((item): item is CareQueueItem => item !== null)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
}
