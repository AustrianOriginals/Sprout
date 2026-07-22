import { z } from 'zod'
import { CARE_EVENT_TYPES } from './constants'

const baseCareEventSchema = z.object({
  id: z.string().uuid(),
  plantId: z.string().uuid(),
  type: z.enum(CARE_EVENT_TYPES),
  performedAt: z.date(),
  scheduledFor: z.date().optional(),
  amountMl: z.number().positive().max(10000).optional(),
  note: z.string().trim().max(500).optional(),
  createdAt: z.date(),
})

const amountOnlyForWatering = (event: { type: string; amountMl?: number }) =>
  event.amountMl === undefined || event.type === 'watering'

export const careEventSchema = baseCareEventSchema.refine(amountOnlyForWatering, {
  message: 'validation.amountOnlyForWatering',
  path: ['amountMl'],
})
export type CareEvent = z.infer<typeof careEventSchema>

export const createCareEventSchema = baseCareEventSchema
  .omit({ id: true, createdAt: true })
  .refine(amountOnlyForWatering, {
    message: 'validation.amountOnlyForWatering',
    path: ['amountMl'],
  })
export type CreateCareEventInput = z.infer<typeof createCareEventSchema>
export type CareEventType = CareEvent['type']
