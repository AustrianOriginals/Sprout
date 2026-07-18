export function getDashboardHeadline(overdueCount: number, dueTodayCount: number): string {
  if (overdueCount > 0) {
    return `${overdueCount} plant${overdueCount === 1 ? '' : 's'} need${overdueCount === 1 ? 's' : ''} water`
  }
  if (dueTodayCount > 0) {
    return `${dueTodayCount} plant${dueTodayCount === 1 ? '' : 's'} thirsty today`
  }
  return "Everything's happy"
}
