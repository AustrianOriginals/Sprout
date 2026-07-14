import Dexie, { type EntityTable } from 'dexie'
import type { Plant } from '@entities/plant'
import type { CareEvent } from '@entities/care-event'
import type { PlantPhoto } from '@entities/plant-photo'

export class SproutDatabase extends Dexie {
  plants!: EntityTable<Plant, 'id'>
  careEvents!: EntityTable<CareEvent, 'id'>
  plantPhotos!: EntityTable<PlantPhoto, 'id'>

  constructor() {
    super('sprout-db')
    this.version(1).stores({
      plants: 'id, careCategory, sunlight, createdAt',
      careEvents: 'id, plantId, type, performedAt',
      plantPhotos: 'id, plantId, takenAt',
    })
  }
}

export const db = new SproutDatabase()
