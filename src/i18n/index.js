import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Dil dosyalarını içe aktarma
import translationEN from './locales/en/translation.json';
import translationTR from './locales/tr/translation.json';

// Kaynaklar
const resources = {
  en: {
    translation: translationEN
  },
  tr: {
    translation: translationTR
  }
};

i18n
  // Dil algılama eklentisi
  .use(LanguageDetector)
  // React için i18next eklentisi
  .use(initReactI18next)
  // i18next başlatma
  .init({
    resources,
    fallbackLng: 'tr', // Varsayılan dil
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false // React zaten XSS koruması sağlıyor
    }
  });

export default i18n; 