export type { PlantPhoto, CreatePlantPhotoInput } from './model/schema'
export { plantPhotoSchema, createPlantPhotoSchema } from './model/schema'
export {
  getAllPlantPhotos,
  getPlantPhotoById,
  getPhotosByPlantId,
  createPlantPhoto,
  deletePlantPhoto,
} from './api/plant-photo-storage'
