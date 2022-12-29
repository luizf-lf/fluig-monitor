import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiInbox } from 'react-icons/fi';
import globalContainerVariants from '../../utils/globalContainerVariants';

export default function SystemTraySettings() {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h3 className="icon-title">
        <span className="icon-dot purple-variant">
          <FiInbox />
        </span>
        {t('components.SystemTraySettings.title')}
      </h3>

      <p>{t('components.SystemTraySettings.helperText')}</p>
    </motion.div>
  );
}
