import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePlants } from '@entities/plant'

export function PlantsPage() {
  const { t } = useTranslation()
  const plants = usePlants()

  return (
    <div className="mx-auto max-w-md space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl">{t('plants.title')}</h1>
        <Link to="/plants/new" className="text-primary underline">
          + {t('plants.addPlant')}
        </Link>
      </div>

      {plants === undefined && <p>{t('plants.loading')}</p>}
      {plants?.length === 0 && <p className="text-muted-foreground">{t('plants.empty')}</p>}

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
