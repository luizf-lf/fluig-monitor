import i18n from 'i18next';
import Backend from 'i18next-fs-backend';
import detector from 'i18next-browser-languagedetector';

// FIXME: Translation does not load on production app
i18n
  .use(detector)
  .use(Backend)
  .init({
    backend: {
      loadPath: './src/renderer/locales/{{lng}}/{{ns}}.json',
      addPath: './src/renderer/locales/{{lng}}/{{ns}}.missing.json',
    },
    interpolation: {
      escapeValue: false,
    },
    saveMissing: true,
    fallbackLng: 'pt',
    debug: true,
  });

export default i18n;
