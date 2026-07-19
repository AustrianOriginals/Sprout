import { useNavigate, useParams } from 'react-router-dom'
import { usePlant } from '@entities/plant'
import { EditPlantForm } from '@features/plant-management/ui/edit-plant-form'

export function EditPlantPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const plant = usePlant(id)

  if (plant === undefined) {
    return <div className="mx-auto max-w-md p-4 text-muted-foreground">Loading…</div>
  }
  if (plant === null) {
    return <div className="mx-auto max-w-md p-4">Pflanze nicht gefunden.</div>
  }

  return (
    <div className="mx-auto max-w-md p-4">
      <EditPlantForm plant={plant} onSuccess={() => navigate(`/plants/${plant.id}`)} />
    </div>
  )
}
