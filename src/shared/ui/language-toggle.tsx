import { useTranslation } from 'react-i18next'
import { useLanguageStore } from '@shared/model/language-store'
import { Button } from '@shared/ui/button'

export function LanguageToggle() {
  const { t } = useTranslation()
  const language = useLanguageStore((state) => state.language)
  const setLanguage = useLanguageStore((state) => state.setLanguage)

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setLanguage(language === 'en' ? 'de' : 'en')}
      aria-label={t('nav.switchLanguage')}
    >
      <span className="text-xs font-semibold uppercase">{language}</span>
    </Button>
  )
}
