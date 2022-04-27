import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import pt from './resources/pt';
import en from './resources/en';

// using resources exported from local files since the 'i18next-fs-backend' package doesn't work properly.
//  it also solves the production build "error".
const resources = {
  pt: {
    translation: pt,
  },
  en: {
    translation: en,
  },
};

i18n.use(detector).init({
  resources,
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ['localStorage'],
    caches: ['localStorage'], // FIXME: Cached language doesn't load on app menu bar
  },
  fallbackLng: 'pt',
  debug: true,
});

export default i18n;
