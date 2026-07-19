import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Droplet, FlaskConical, Sprout, Check, type LucideIcon } from 'lucide-react'
import type { CareEventType } from '@entities/care-event'
import { useCareQueue, logCareEvent, type CareQueueItem } from '@features/care-scheduling'
import { Button } from '@shared/ui/button'
import { cn } from '@shared/lib/utils'
import { getGreeting } from '../lib/greeting'
import { getDashboardHeadline } from '../lib/headline'

const CARE_TYPE_LABELS: Record<CareEventType, string> = {
  watering: 'Water',
  fertilizing: 'Fertilize',
  repotting: 'Repot',
}

const CARE_TYPE_ICONS: Record<CareEventType, LucideIcon> = {
  watering: Droplet,
  fertilizing: FlaskConical,
  repotting: Sprout,
}

export function DashboardPage() {
  const queue = useCareQueue()
  const [loggingKey, setLoggingKey] = useState<string | null>(null)

  if (queue === undefined) {
    return <div className="mx-auto max-w-md p-4 text-muted-foreground">Loading…</div>
  }

  const overdueCount = queue.filter((item) => item.status === 'overdue').length
  const dueTodayCount = queue.filter((item) => item.status === 'due_today').length
  const upcomingCount = queue.filter((item) => item.status === 'upcoming').length

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
        <p className="text-sm text-muted-foreground">{getGreeting()}</p>
        <h1 className="font-serif text-3xl">
          {getDashboardHeadline(overdueCount, dueTodayCount)} 🌿
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Overdue" value={overdueCount} tone="overdue" />
        <StatCard label="Due Today" value={dueTodayCount} tone="due_today" />
        <StatCard label="Coming Up" value={upcomingCount} tone="upcoming" />
      </div>

      {queue.length === 0 ? (
        <div className="space-y-2 rounded-lg border p-4 text-center">
          <p className="text-muted-foreground">No plants yet.</p>
          <Link to="/plants/new" className="text-primary underline">
            Add your first plant
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          <h2 className="font-serif text-lg">🌿 Care queue</h2>
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
          View all plants →
        </Link>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Stored privately on this device · Works offline
      </p>
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
  const Icon = CARE_TYPE_ICONS[item.type]

  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border p-3">
      <Link to={`/plants/${item.plantId}`} className="min-w-0 flex-1">
        <p className="truncate font-medium">
          <Icon className="mr-1 inline h-4 w-4 text-blue-500" />
          {CARE_TYPE_LABELS[item.type]} {item.plantName}
        </p>
        <p className="text-sm text-muted-foreground">{formatDueText(item)}</p>
      </Link>
      <Button
        size="icon"
        variant="outline"
        disabled={isLogging}
        onClick={onMarkDone}
        aria-label={`Mark ${item.plantName} as ${CARE_TYPE_LABELS[item.type].toLowerCase()}ed`}
        className="shrink-0 rounded-full border-primary text-primary hover:bg-primary/10"
      >
        <Check className="h-4 w-4" />
      </Button>
    </li>
  )
}

function formatDueText(item: CareQueueItem): string {
  if (item.status === 'overdue') {
    const days = Math.abs(item.daysUntil)
    return `${days} day${days === 1 ? '' : 's'} overdue`
  }
  if (item.status === 'due_today') {
    return 'Due today'
  }
  return `in ${item.daysUntil} day${item.daysUntil === 1 ? '' : 's'}`
}
