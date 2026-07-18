import { z } from 'zod'
import { createPlantSchema } from '@entities/plant'

export const createPlantFormSchema = createPlantSchema.extend({
  lastWateredAt: z.date({ error: 'Bitte gib an, wann zuletzt gegossen wurde' }),
})

export type CreatePlantFormValues = z.infer<typeof createPlantFormSchema>
