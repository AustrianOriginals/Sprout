import { Link } from 'react-router-dom'
import { usePlants } from '@entities/plant'

export function PlantsPage() {
  const plants = usePlants()

  return (
    <div className="mx-auto max-w-md space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl">Plants</h1>
        <Link to="/plants/new" className="text-primary underline">
          + Add plant
        </Link>
      </div>

      {plants === undefined && <p>Lädt …</p>}
      {plants?.length === 0 && (
        <p className="text-muted-foreground">Noch keine Pflanzen angelegt.</p>
      )}

      <ul className="space-y-2">
        {plants?.map((plant) => (
          <li key={plant.id}>
            <Link
              to={`/plants/${plant.id}`}
              className="block rounded-lg border p-3 hover:bg-muted/30"
            >
              <p className="font-medium">{plant.name}</p>
              <p className="text-sm text-muted-foreground">{plant.species}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
