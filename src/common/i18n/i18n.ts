import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import pt from './resources/pt.json';
import en from './resources/en.json';

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

// i18next native detection/caching will not be used, since saving the selected language to the database is easier
i18n.use(detector).init({
  resources,
  interpolation: {
    escapeValue: false,
  },
  fallbackLng: 'pt',
  debug: true,
});

export default i18n;
