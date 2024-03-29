import pt from './pt.json';
import en from './en.json';

// using resources exported from local files since the 'i18next-fs-backend' package doesn't work properly.
//  it also solves the production build "error".
const languageResources = {
  pt: {
    translation: pt,
  },
  en: {
    translation: en,
  },
};

export default languageResources;
