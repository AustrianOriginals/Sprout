import { useTranslation } from 'react-i18next'
import { Trash2 } from 'lucide-react'
import { useObjectUrl } from '@shared/lib/use-object-url'
import { Dialog, DialogContent, DialogTitle } from '@shared/ui/dialog'
import { Button } from '@shared/ui/button'
import type { PlantPhoto } from '../model/schema'

type PhotoLightboxProps = {
  photo: PlantPhoto | null
  onClose: () => void
  onDelete: (photoId: string) => void
}

export function PhotoLightbox({ photo, onClose, onDelete }: PhotoLightboxProps) {
  const { t, i18n } = useTranslation()
  const url = useObjectUrl(photo?.image)

  return (
    <Dialog open={photo !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogTitle className="sr-only">{t('photos.title')}</DialogTitle>
        {url && <img src={url} alt={photo?.caption ?? ''} className="w-full rounded-lg" />}
        {photo && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-muted-foreground">
              {photo.takenAt.toLocaleDateString(i18n.language)}
            </p>
            <Button variant="destructive" size="sm" onClick={() => onDelete(photo.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              {t('plantDetail.delete')}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
