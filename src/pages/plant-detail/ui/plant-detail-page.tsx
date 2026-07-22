import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { usePlant } from '@entities/plant'
import { useCareEventsByPlantId } from '@entities/care-event/model/hooks'
import { PhotoGallery } from '@entities/plant-photo'
import { useCareQueue, formatDueText } from '@features/care-scheduling'
import { deletePlantWithHistory } from '@features/plant-management'
import { Button } from '@shared/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@shared/ui/alert-dialog'

export function PlantDetailPage() {
  const { t, i18n } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const plant = usePlant(id)
  const history = useCareEventsByPlantId(id)
  const queue = useCareQueue()
  const [isDeleting, setIsDeleting] = useState(false)

  if (plant === undefined) {
    return (
      <div className="mx-auto max-w-md p-4 text-muted-foreground">{t('plantDetail.loading')}</div>
    )
  }

  if (plant === null) {
    return (
      <div className="mx-auto max-w-md space-y-2 p-4">
        <p>{t('plantDetail.notFound')}</p>
        <Link to="/plants" className="text-primary underline">
          {t('plantDetail.backToOverview')}
        </Link>
      </div>
    )
  }

  const plantId = plant.id
  const upcomingCare = queue?.filter((item) => item.plantId === plantId) ?? []
  const sortedHistory = [...(history ?? [])].sort(
    (a, b) => b.performedAt.getTime() - a.performedAt.getTime()
  )

  async function handleDelete() {
    setIsDeleting(true)
    try {
      await deletePlantWithHistory(plantId)
      navigate('/plants')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl">{plant.name}</h1>
          <p className="text-muted-foreground">{plant.species}</p>
        </div>
        <Link to={`/plants/${plant.id}/edit`}>
          <Button variant="outline" size="sm">
            {t('plantDetail.edit')}
          </Button>
        </Link>
      </div>

      <div className="space-y-1 rounded-lg border p-3 text-sm">
        <p>☀️ {t(`plants.sunlight.${plant.sunlight}`)}</p>
        <p>
          🪴 {plant.pot.diameterCm}cm, {t(`plants.potMaterial.${plant.pot.material}`)}
        </p>
        <p>
          📍 {t(`plants.locationType.${plant.location.type}`)}
          {plant.location.room ? ` – ${plant.location.room}` : ''}
        </p>
        {plant.notes && <p className="text-muted-foreground">{plant.notes}</p>}
      </div>

      <PhotoGallery plantId={plant.id} />

      <div className="space-y-2">
        <h2 className="font-serif text-lg">{t('plantDetail.upcomingCare')}</h2>
        <ul className="space-y-1 text-sm">
          {upcomingCare.map((item) => (
            <li key={item.type}>
              {t(`dashboard.careType.${item.type}`)}: {formatDueText(item, t)}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <h2 className="font-serif text-lg">{t('plantDetail.history')}</h2>
        {sortedHistory.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('plantDetail.noHistory')}</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {sortedHistory.slice(0, 10).map((event) => (
              <li key={event.id}>
                {t(`dashboard.careType.${event.type}`)} –{' '}
                {event.performedAt.toLocaleDateString(i18n.language)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button variant="destructive" className="w-full">
              {t('plantDetail.deletePlant')}
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('plantDetail.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('plantDetail.deleteConfirmDescription', { name: plant.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('plantDetail.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? t('plantDetail.deleting') : t('plantDetail.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
