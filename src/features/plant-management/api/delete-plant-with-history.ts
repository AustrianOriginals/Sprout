import { db } from '@shared/api/db'

export async function deletePlantWithHistory(plantId: string): Promise<void> {
  await db.transaction('rw', db.plants, db.careEvents, db.plantPhotos, async () => {
    await db.careEvents.where('plantId').equals(plantId).delete()
    await db.plantPhotos.where('plantId').equals(plantId).delete()
    await db.plants.delete(plantId)
  })
}
