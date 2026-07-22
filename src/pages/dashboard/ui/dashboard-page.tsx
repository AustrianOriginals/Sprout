import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Droplet, FlaskConical, Sprout, Check, type LucideIcon } from 'lucide-react'
import type { CareEventType } from '@entities/care-event'
import {
  useCareQueue,
  logCareEvent,
  formatDueText,
  type CareQueueItem,
} from '@features/care-scheduling'
import { Button } from '@shared/ui/button'
import { cn } from '@shared/lib/utils'
import { getGreetingKey } from '../lib/greeting'
import { getDashboardHeadlineKey } from '../lib/headline'

const CARE_TYPE_ICONS: Record<CareEventType, LucideIcon> = {
  watering: Droplet,
  fertilizing: FlaskConical,
  repotting: Sprout,
}

export function DashboardPage() {
  const { t } = useTranslation()
  const queue = useCareQueue()
  const [loggingKey, setLoggingKey] = useState<string | null>(null)

  if (queue === undefined) {
    return (
      <div className="mx-auto max-w-md p-4 text-muted-foreground">{t('dashboard.loading')}</div>
    )
  }

  const overdueCount = queue.filter((item) => item.status === 'overdue').length
  const dueTodayCount = queue.filter((item) => item.status === 'due_today').length
  const upcomingCount = queue.filter((item) => item.status === 'upcoming').length
  const headline = getDashboardHeadlineKey(overdueCount, dueTodayCount)

  async function handleMarkDone(item: CareQueueItem) {
    const key = `${item.plantId}-${item.type}`
    setLoggingKey(key)
    try {
      await logCareEvent(item.type, item.plantId)
    } finally {
      setLoggingKey(null)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 p-4">
      <div>
        <p className="text-sm text-muted-foreground">{t(getGreetingKey())}</p>
        <h1 className="font-serif text-3xl">{t(headline.key, { count: headline.count })} 🌿</h1>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label={t('dashboard.stats.overdue')} value={overdueCount} tone="overdue" />
        <StatCard label={t('dashboard.stats.dueToday')} value={dueTodayCount} tone="due_today" />
        <StatCard label={t('dashboard.stats.comingUp')} value={upcomingCount} tone="upcoming" />
      </div>

      {queue.length === 0 ? (
        <div className="space-y-2 rounded-lg border p-4 text-center">
          <p className="text-muted-foreground">{t('dashboard.noPlantsYet')}</p>
          <Link to="/plants/new" className="text-primary underline">
            {t('dashboard.addFirstPlant')}
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          <h2 className="font-serif text-lg">🌿 {t('dashboard.careQueue')}</h2>
          <ul className="space-y-2">
            {queue.slice(0, 5).map((item) => (
              <CareQueueRow
                key={`${item.plantId}-${item.type}`}
                item={item}
                isLogging={loggingKey === `${item.plantId}-${item.type}`}
                onMarkDone={() => handleMarkDone(item)}
              />
            ))}
          </ul>
        </div>
      )}

      <div className="text-center">
        <Link to="/plants" className="text-primary underline">
          {t('dashboard.viewAllPlants')}
        </Link>
      </div>

      <p className="text-center text-xs text-muted-foreground">{t('dashboard.footer')}</p>
    </div>
  )
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: 'overdue' | 'due_today' | 'upcoming'
}) {
  const toneClass =
    tone === 'overdue'
      ? 'text-destructive'
      : tone === 'due_today'
        ? 'text-warning'
        : 'text-foreground'

  return (
    <div className="rounded-lg border bg-muted/30 p-3 text-center">
      <p className={cn('text-2xl font-semibold', toneClass)}>{value}</p>
      <p className="text-xs tracking-wide text-muted-foreground uppercase">{label}</p>
    </div>
  )
}

function CareQueueRow({
  item,
  isLogging,
  onMarkDone,
}: {
  item: CareQueueItem
  isLogging: boolean
  onMarkDone: () => void
}) {
  const { t } = useTranslation()
  const Icon = CARE_TYPE_ICONS[item.type]

  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border p-3">
      <Link to={`/plants/${item.plantId}`} className="min-w-0 flex-1">
        <p className="truncate font-medium">
          <Icon className="mr-1 inline h-4 w-4 text-blue-500" />
          {t(`dashboard.careType.${item.type}`)} {item.plantName}
        </p>
        <p className="text-sm text-muted-foreground">{formatDueText(item, t)}</p>
      </Link>
      <Button
        size="icon"
        variant="outline"
        disabled={isLogging}
        onClick={onMarkDone}
        aria-label={t('dashboard.markAsDone', {
          plantName: item.plantName,
          action: t(`dashboard.action.${item.type}`),
        })}
        className="shrink-0 rounded-full border-primary text-primary hover:bg-primary/10"
      >
        <Check className="h-4 w-4" />
      </Button>
    </li>
  )
}
