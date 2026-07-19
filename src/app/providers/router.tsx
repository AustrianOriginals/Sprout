import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '../layout/app-layout'
import { DashboardPage } from '@pages/dashboard'
import { PlantsPage } from '@pages/plants'
import { AddPlantPage } from '@pages/add-plant'
import { PlantDetailPage } from '@pages/plant-detail/ui/plant-detail-page'
import { EditPlantPage } from '@pages/edit-plant/ui/edit-plant-page'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/plants" element={<PlantsPage />} />
          <Route path="/plants/new" element={<AddPlantPage />} />
          <Route path="/plants/:id" element={<PlantDetailPage />} />
          <Route path="/plants/:id/edit" element={<EditPlantPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
