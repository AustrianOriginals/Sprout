import { useLiveQuery } from 'dexie-react-hooks'
import { getWateringCareQueue } from '../api/get-care-queue'
import type { CareQueueItem } from '../api/get-care-queue'

export function useWateringCareQueue(): CareQueueItem[] | undefined {
  return useLiveQuery(() => getWateringCareQueue())
}
