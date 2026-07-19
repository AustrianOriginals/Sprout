import { getAllPlants } from '@entities/plant'
import type { CareEventType } from '@entities/care-event'
import { getCareStatus, daysUntil, type CareStatus } from '../lib/care-status'
import { getNextWateringDateForPlant } from './get-next-watering-date'
import { getNextFertilizingDateForPlant } from './get-next-fertilizing-date'
import { getNextRepottingDateForPlant } from './get-next-repotting-date'

export type CareQueueItem = {
  plantId: string
  plantName: string
  type: CareEventType
  dueDate: Date
  status: CareStatus
  daysUntil: number
}

const CARE_TYPE_RESOLVERS: Record<CareEventType, (plantId: string) => Promise<Date | null>> = {
  watering: getNextWateringDateForPlant,
  fertilizing: getNextFertilizingDateForPlant,
  repotting: getNextRepottingDateForPlant,
}

export async function getCareQueue(): Promise<CareQueueItem[]> {
  const plants = await getAllPlants()
  const careTypes = Object.keys(CARE_TYPE_RESOLVERS) as CareEventType[]

  const items = await Promise.all(
    plants.flatMap((plant) =>
      careTypes.map(async (type): Promise<CareQueueItem | null> => {
        const dueDate = await CARE_TYPE_RESOLVERS[type](plant.id)
        if (!dueDate) return null

        return {
          plantId: plant.id,
          plantName: plant.name,
          type,
          dueDate,
          status: getCareStatus(dueDate),
          daysUntil: daysUntil(dueDate),
        }
      })
    )
  )

  return items
    .filter((item): item is CareQueueItem => item !== null)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
}
