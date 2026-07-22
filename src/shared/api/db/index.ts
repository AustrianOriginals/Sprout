import Dexie, { type EntityTable } from 'dexie'
import type { Plant } from '@entities/plant'
import type { CareEvent } from '@entities/care-event'
import type { PlantPhoto } from '@entities/plant-photo'

type EncryptionKeyRecord = { id: string; key: CryptoKey }

export class SproutDatabase extends Dexie {
  plants!: EntityTable<Plant, 'id'>
  careEvents!: EntityTable<CareEvent, 'id'>
  plantPhotos!: EntityTable<PlantPhoto, 'id'>
  encryptionKeys!: EntityTable<EncryptionKeyRecord, 'id'>

  constructor() {
    super('sprout-db')

    this.version(1).stores({
      plants: 'id, careCategory, sunlight, createdAt',
      careEvents: 'id, plantId, type, performedAt',
      plantPhotos: 'id, plantId, takenAt',
    })

    // neue Tabelle für den Verschlüsselungsschlüssel.
    this.version(2).stores({
      plants: 'id, careCategory, sunlight, createdAt',
      careEvents: 'id, plantId, type, performedAt',
      plantPhotos: 'id, plantId, takenAt',
      encryptionKeys: 'id',
    })
  }
}

export const db = new SproutDatabase()
