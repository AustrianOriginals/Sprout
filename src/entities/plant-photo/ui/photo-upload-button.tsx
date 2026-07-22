import { useRef, useState, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Camera } from 'lucide-react'
import { createPlantPhoto } from '../api/plant-photo-storage'
import { Button } from '@shared/ui/button'

type PhotoUploadButtonProps = {
  plantId: string
}

export function PhotoUploadButton({ plantId }: PhotoUploadButtonProps) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setIsUploading(true)
    setError(null)
    try {
      await createPlantPhoto({ plantId, image: file, takenAt: new Date() })
    } catch {
      setError(t('photos.uploadError'))
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
      >
        <Camera className="mr-2 h-4 w-4" />
        {isUploading ? t('photos.uploading') : t('photos.addPhoto')}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  )
}
