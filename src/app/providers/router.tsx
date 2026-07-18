import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DashboardPage } from '@pages/dashboard'
import { PlantsPage } from '@pages/plants'
import { AddPlantPage } from '@pages/add-plant'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/plants" element={<PlantsPage />} />
        <Route path="/plants/new" element={<AddPlantPage />} />
      </Routes>
    </BrowserRouter>
  )
}
