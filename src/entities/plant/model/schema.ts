import { z } from 'zod'
import {
  SUNLIGHT_EXPOSURES,
  PLANT_SIZES,
  POT_MATERIALS,
  LOCATION_TYPES,
  CARE_CATEGORIES,
} from './constants'

const potSchema = z.object({
  diameterCm: z.number().positive().max(500),
  heightCm: z.number().positive().max(500).optional(),
  material: z.enum(POT_MATERIALS),
  hasDrainageHole: z.boolean(),
})

const locationSchema = z.object({
  type: z.enum(LOCATION_TYPES),
  room: z.string().trim().max(60).optional(),
})

const careCycleOverrideSchema = z.object({
  wateringDays: z.number().int().positive().optional(),
  fertilizingDays: z.number().int().positive().optional(),
  repottingDays: z.number().int().positive().optional(),
})

export const plantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1, 'validation.nameRequired').max(80),
  species: z.string().trim().min(1, 'validation.speciesRequired').max(120),
  careCategory: z.enum(CARE_CATEGORIES),
  sunlight: z.enum(SUNLIGHT_EXPOSURES),
  size: z.enum(PLANT_SIZES),
  pot: potSchema,
  location: locationSchema,
  acquiredAt: z.date(),
  notes: z.string().trim().max(1000).optional(),
  careCycleOverride: careCycleOverrideSchema.optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Plant = z.infer<typeof plantSchema>
export type PlantPot = z.infer<typeof potSchema>
export type PlantLocation = z.infer<typeof locationSchema>
export type CareCycleOverride = z.infer<typeof careCycleOverrideSchema>

export const createPlantSchema = plantSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
export type CreatePlantInput = z.infer<typeof createPlantSchema>
