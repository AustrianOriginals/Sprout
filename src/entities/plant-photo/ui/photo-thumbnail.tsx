import { useObjectUrl } from '@shared/lib/use-object-url'
import type { PlantPhoto } from '../model/schema'

type PhotoThumbnailProps = {
  photo: PlantPhoto
  onClick?: () => void
}

export function PhotoThumbnail({ photo, onClick }: PhotoThumbnailProps) {
  const url = useObjectUrl(photo.image)

  if (!url) return null

  return (
    <button
      type="button"
      onClick={onClick}
      className="aspect-square overflow-hidden rounded-lg border"
    >
      <img src={url} alt={photo.caption ?? 'Plant photo'} className="h-full w-full object-cover" />
    </button>
  )
}
