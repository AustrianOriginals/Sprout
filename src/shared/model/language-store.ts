import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18n from '@shared/config/i18n'

export type Language = 'en' | 'de'

type LanguageState = {
  language: Language
  setLanguage: (language: Language) => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => {
        i18n.changeLanguage(language)
        set({ language })
      },
    }),
    {
      name: 'sprout-language',
      onRehydrateStorage: () => (state) => {
        if (state) {
          i18n.changeLanguage(state.language)
        }
      },
    }
  )
)
