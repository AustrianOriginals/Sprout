import { useNavigate } from 'react-router-dom'
import { CreatePlantForm } from '@features/plant-management'

export function AddPlantPage() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-md p-4">
      <CreatePlantForm onSuccess={() => navigate('/')} />
    </div>
  )
}
