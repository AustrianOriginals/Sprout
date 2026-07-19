import { useLiveQuery } from 'dexie-react-hooks'
import { getCareQueue } from '../api/get-care-queue'
import type { CareQueueItem } from '../api/get-care-queue'

export function useCareQueue(): CareQueueItem[] | undefined {
  return useLiveQuery(() => getCareQueue())
}
