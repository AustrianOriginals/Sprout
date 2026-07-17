import type { Plant } from '@entities/plant'
import type { CareEvent } from '@entities/care-event'

export function buildPlant(overrides: Partial<Plant> = {}): Plant {
  return {
    id: crypto.randomUUID(),
    name: 'Testpflanze',
    species: 'Monstera Deliciosa',
    careCategory: 'tropical',
    sunlight: 'medium',
    size: 'medium',
    pot: { diameterCm: 12, heightCm: 12, material: 'plastic', hasDrainageHole: true },
    location: { type: 'indoor' },
    acquiredAt: new Date('2026-01-01'),
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ...overrides,
  }
}

export function buildCareEvent(overrides: Partial<CareEvent> = {}): CareEvent {
  return {
    id: crypto.randomUUID(),
    plantId: 'plant-1',
    type: 'watering',
    performedAt: new Date('2026-01-10'),
    scheduledFor: new Date('2026-01-10'),
    createdAt: new Date('2026-01-10'),
    ...overrides,
  }
}
