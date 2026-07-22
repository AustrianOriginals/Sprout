import { useLiveQuery } from 'dexie-react-hooks'
import { getPhotosByPlantId } from '../api/plant-photo-storage'
import type { PlantPhoto } from './schema'

export function usePhotosByPlantId(plantId: string | undefined): PlantPhoto[] | undefined {
  return useLiveQuery(() => (plantId ? getPhotosByPlantId(plantId) : undefined), [plantId])
}
