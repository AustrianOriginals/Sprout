export type CareStatus = 'overdue' | 'due_today' | 'upcoming'

export function getCareStatus(dueDate: Date, now: Date = new Date()): CareStatus {
  const due = startOfDay(dueDate)
  const today = startOfDay(now)

  if (due < today) return 'overdue'
  if (due.getTime() === today.getTime()) return 'due_today'
  return 'upcoming'
}

export function daysUntil(dueDate: Date, now: Date = new Date()): number {
  const msPerDay = 1000 * 60 * 60 * 24
  return Math.round((startOfDay(dueDate).getTime() - startOfDay(now).getTime()) / msPerDay)
}

function startOfDay(date: Date): Date {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}
