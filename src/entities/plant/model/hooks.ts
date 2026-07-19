import { useLiveQuery } from 'dexie-react-hooks'
import { getAllPlants, getPlantById } from '../api/plant-storage'
import type { Plant } from './schema'

export function usePlants(): Plant[] | undefined {
  return useLiveQuery(() => getAllPlants())
}

export function usePlant(id: string | undefined): Plant | null | undefined {
  return useLiveQuery(async () => {
    if (!id) return null
    const plant = await getPlantById(id)
    return plant ?? null
  }, [id])
}
