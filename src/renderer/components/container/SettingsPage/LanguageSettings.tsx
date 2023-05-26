import { ipcRenderer } from 'electron';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiCompass } from 'react-icons/fi';
import globalContainerVariants from '../../../utils/globalContainerVariants';

export default function LanguageSettings() {
  const { t, i18n } = useTranslation();

  // sends an ipc signal, since the i18n language must be changed on the main process to also
  //  update the language on the database
  function dispatchLanguageChange(lang: string) {
    ipcRenderer.invoke('updateLanguage', lang);
  }

  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h3 className="icon-title">
        <span className="icon-dot">
          <FiCompass />
        </span>
        {t('components.LanguageSettings.title')}
      </h3>
      <p className="mb-2">{t('components.LanguageSettings.helperText')}</p>

      <div className="form-group" style={{ gap: '.25rem' }}>
        <label htmlFor="radioLanguage_pt">
          <input
            type="radio"
            name="radioLanguage"
            id="radioLanguage_pt"
            checked={i18n.language === 'pt'}
            onChange={() => dispatchLanguageChange('pt')}
          />{' '}
          {t('menu.languages.pt')}
        </label>
        <label htmlFor="radioLanguage_en">
          <input
            type="radio"
            name="radioLanguage"
            id="radioLanguage_en"
            checked={i18n.language === 'en'}
            onChange={() => dispatchLanguageChange('en')}
          />{' '}
          {t('menu.languages.en')}
        </label>
      </div>
    </motion.div>
  );
}
