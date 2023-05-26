import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import languageResources from './resources/languageResources';

// i18next native detection/caching will not be used, since saving the selected language to the database is easier
i18n.use(detector).init({
  resources: languageResources,
  interpolation: {
    escapeValue: false,
  },
  fallbackLng: 'pt',
  debug: true,
});

export default i18n;
