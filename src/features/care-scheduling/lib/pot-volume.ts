import type { PlantPot } from '@entities/plant'

const SOIL_FILL_RATIO = 0.85 // Erde füllt Topf nie bis zum Rand
const REFERENCE_POT_VOLUME_CM3 = 1000 // entspricht etwa einem 12×12cm Standardtopf

export function estimateSoilVolumeCm3(pot: PlantPot): number {
  const effectiveHeight = pot.heightCm ?? pot.diameterCm
  const radius = pot.diameterCm / 2
  return Math.PI * radius ** 2 * effectiveHeight * SOIL_FILL_RATIO
}

export function potVolumeModifier(pot: PlantPot): number {
  const volumeRatio = estimateSoilVolumeCm3(pot) / REFERENCE_POT_VOLUME_CM3
  return clamp(volumeRatio, 0.6, 1.6)
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
