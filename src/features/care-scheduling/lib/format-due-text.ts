import type { TFunction } from 'i18next'
import type { CareQueueItem } from '../api/get-care-queue'

export function formatDueText(
  item: Pick<CareQueueItem, 'status' | 'daysUntil'>,
  t: TFunction
): string {
  if (item.status === 'overdue') {
    return t('care.due.overdue', { count: Math.abs(item.daysUntil) })
  }
  if (item.status === 'due_today') {
    return t('care.due.today')
  }
  return t('care.due.in', { count: item.daysUntil })
}
