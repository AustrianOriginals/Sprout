import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { usePlant } from '@entities/plant'
import { useCareEventsByPlantId } from '@entities/care-event/model/hooks'
import { useCareQueue } from '@features/care-scheduling'
import { deletePlantWithHistory } from '@features/plant-management/api/delete-plant-with-history'
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
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const plant = usePlant(id)
  const history = useCareEventsByPlantId(id)
  const queue = useCareQueue()
  const [isDeleting, setIsDeleting] = useState(false)

  if (plant === undefined) {
    return <div className="mx-auto max-w-md p-4 text-muted-foreground">Loading…</div>
  }

  if (plant === null) {
    return (
      <div className="mx-auto max-w-md space-y-2 p-4">
        <p>Pflanze nicht gefunden.</p>
        <Link to="/plants" className="text-primary underline">
          Zurück zur Übersicht
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
            Edit
          </Button>
        </Link>
      </div>

      <div className="space-y-1 rounded-lg border p-3 text-sm">
        <p>☀️ {plant.sunlight}</p>
        <p>
          🪴 {plant.pot.diameterCm}cm, {plant.pot.material}
        </p>
        <p>
          📍 {plant.location.type}
          {plant.location.room ? ` – ${plant.location.room}` : ''}
        </p>
        {plant.notes && <p className="text-muted-foreground">{plant.notes}</p>}
      </div>

      <div className="space-y-2">
        <h2 className="font-serif text-lg">Upcoming care</h2>
        <ul className="space-y-1 text-sm">
          {upcomingCare.map((item) => (
            <li key={item.type}>
              {item.type}: {item.dueDate.toLocaleDateString('de-DE')} ({item.status})
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <h2 className="font-serif text-lg">History</h2>
        {sortedHistory.length === 0 ? (
          <p className="text-sm text-muted-foreground">Noch keine Einträge.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {sortedHistory.slice(0, 10).map((event) => (
              <li key={event.id}>
                {event.type} – {event.performedAt.toLocaleDateString('de-DE')}
              </li>
            ))}
          </ul>
        )}
      </div>

      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button variant="destructive" className="w-full">
              Delete plant
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Pflanze wirklich löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Dies löscht "{plant.name}" sowie die komplette Pflege- und Foto-Historie
              unwiderruflich.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Wird gelöscht …' : 'Löschen'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
