import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePhotosByPlantId } from '../model/hooks'
import { deletePlantPhoto } from '../api/plant-photo-storage'
import type { PlantPhoto } from '../model/schema'
import { PhotoThumbnail } from './photo-thumbnail'
import { PhotoUploadButton } from './photo-upload-button'
import { PhotoLightbox } from './photo-lightbox'

type PhotoGalleryProps = {
  plantId: string
}

export function PhotoGallery({ plantId }: PhotoGalleryProps) {
  const { t } = useTranslation()
  const photos = usePhotosByPlantId(plantId)
  const [selectedPhoto, setSelectedPhoto] = useState<PlantPhoto | null>(null)
  const sorted = [...(photos ?? [])].sort((a, b) => b.takenAt.getTime() - a.takenAt.getTime())

  async function handleDelete(photoId: string) {
    await deletePlantPhoto(photoId)
    setSelectedPhoto(null)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg">{t('photos.title')}</h2>
        <PhotoUploadButton plantId={plantId} />
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('photos.noPhotos')}</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {sorted.map((photo) => (
            <PhotoThumbnail key={photo.id} photo={photo} onClick={() => setSelectedPhoto(photo)} />
          ))}
        </div>
      )}

      <PhotoLightbox
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onDelete={handleDelete}
      />
    </div>
  )
}
