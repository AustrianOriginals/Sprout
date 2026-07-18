import { db } from '@shared/api/db'
import { plantSchema, type Plant } from '@entities/plant'
import { careEventSchema } from '@entities/care-event'
import type { CreatePlantFormValues } from '../model/create-plant-form-schema'

export async function createPlantWithInitialWatering(input: CreatePlantFormValues): Promise<Plant> {
  const { lastWateredAt, ...plantInput } = input
  const now = new Date()

  const plant: Plant = {
    ...plantInput,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  }
  const validatedPlant = plantSchema.parse(plant)

  const careEvent = careEventSchema.parse({
    id: crypto.randomUUID(),
    plantId: validatedPlant.id,
    type: 'watering',
    performedAt: lastWateredAt,
    createdAt: now,
  })

  await db.transaction('rw', db.plants, db.careEvents, async () => {
    await db.plants.add(validatedPlant)
    await db.careEvents.add(careEvent)
  })

  return validatedPlant
}
