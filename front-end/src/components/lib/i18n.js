import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import fr from '/public/locales/fr/translation.json'
import frForm from '/public/locales/fr/translationForm.json'
import frPDFExportForm from '/public/locales/fr/translationPDFExportForm.json'

import en from '/public/locales/en/translation.json'
import enForm from '/public/locales/en/translationForm.json'
import enPDFExportForm from '/public/locales/en/translationPDFExportForm.json'

/*
  import { useTranslation } from 'react-i18next'
  const { t, i18n } = useTranslation()

  <button onClick={() => i18n.changeLanguage('fr')}>fr</button>
  <button onClick={() => i18n.changeLanguage('en')}>en</button>
*/

  i18n
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    interpolation: { escapeValue: false }, // React already does escaping
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {...en, ...enForm, ...enPDFExportForm}
      },

      fr: {
        translation: {...fr, ...frForm, ...frPDFExportForm},
      },

    },
  })
  //i18n.changeLanguage('en');

export default i18n;