import { useLiveQuery } from 'dexie-react-hooks'
import { getCareEventsByPlantId } from '../api/care-event-storage'
import type { CareEvent } from './schema'

export function useCareEventsByPlantId(plantId: string | undefined): CareEvent[] | undefined {
  return useLiveQuery(() => (plantId ? getCareEventsByPlantId(plantId) : undefined), [plantId])
}
