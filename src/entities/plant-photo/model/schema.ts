import { z } from 'zod'

const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export const plantPhotoSchema = z.object({
  id: z.string().uuid(),
  plantId: z.string().uuid(),
  image: z.instanceof(Blob).refine((blob) => blob.size <= MAX_PHOTO_SIZE_BYTES, {
    message: 'Foto darf maximal 5 MB groß sein',
  }),
  takenAt: z.date(),
  caption: z.string().trim().max(200).optional(),
  createdAt: z.date(),
})

export type PlantPhoto = z.infer<typeof plantPhotoSchema>

export const createPlantPhotoSchema = plantPhotoSchema.omit({
  id: true,
  createdAt: true,
})
export type CreatePlantPhotoInput = z.infer<typeof createPlantPhotoSchema>
