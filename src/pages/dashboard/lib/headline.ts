type HeadlineResult = { key: string; count?: number }

export function getDashboardHeadlineKey(
  overdueCount: number,
  dueTodayCount: number
): HeadlineResult {
  if (overdueCount > 0) {
    return { key: 'dashboard.headline.needsWater', count: overdueCount }
  }
  if (dueTodayCount > 0) {
    return { key: 'dashboard.headline.thirstyToday', count: dueTodayCount }
  }
  return { key: 'dashboard.headline.allHappy' }
}
