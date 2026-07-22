import { useTranslation } from 'react-i18next'
import { Heart, Mail } from 'lucide-react'
import { Button } from '@shared/ui/button'
import supportIllustration from '../assets/support-illustration.png'

const DONATION_URL = 'https://ko-fi.com/your-username'
const FEEDBACK_EMAIL = 'sprout-feedback@example.com'
const GITHUB_ISSUES_URL = 'https://github.com/your-username/sprout/issues/new'

export function SupportPage() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto max-w-md space-y-8 p-4 text-center">
      <div className="space-y-6">
        <img src={supportIllustration} alt="" className="mx-auto h-48 w-48" />

        <div className="space-y-2">
          <h1 className="font-serif text-2xl">{t('support.title')}</h1>
          <p className="text-muted-foreground">{t('support.description')}</p>
        </div>

        <a href={DONATION_URL} target="_blank" rel="noopener noreferrer">
          <Button className="w-full">
            <Heart className="mr-2 h-4 w-4" />
            {t('support.donateButton')}
          </Button>
        </a>

        <p className="text-xs text-muted-foreground">{t('support.redirectNotice')}</p>
      </div>

      <div className="space-y-3 border-t pt-6">
        <h2 className="font-serif text-lg">{t('support.feedbackTitle')}</h2>
        <p className="text-sm text-muted-foreground">{t('support.feedbackDescription')}</p>

        <a href={`mailto:${FEEDBACK_EMAIL}?subject=Sprout%20feedback`}>
          <Button variant="outline" className="w-full">
            <Mail className="mr-2 h-4 w-4" />
            {t('support.emailButton')}
          </Button>
        </a>

        <a
          href={GITHUB_ISSUES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground underline"
        >
          {t('support.githubLink')}
        </a>
      </div>
    </div>
  )
}
