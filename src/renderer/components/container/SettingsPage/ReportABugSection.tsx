import { shell } from 'electron';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiCrosshair, FiExternalLink } from 'react-icons/fi';
import globalContainerVariants from '../../../utils/globalContainerVariants';

export default function ReportABugSection() {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h3 className="icon-title">
        <span className="icon-dot yellow-variant">
          <FiCrosshair />
        </span>
        {t('components.ReportABugSection.title')}
      </h3>

      <p className="mt-2">{t('components.ReportABugSection.headline1')}</p>
      <p>{t('components.ReportABugSection.headline2')}</p>

      <button
        type="button"
        className="button is-default mt-2"
        onClick={() =>
          shell.openExternal(
            'https://github.com/luizf-lf/fluig-monitor/issues/new/choose'
          )
        }
      >
        <FiExternalLink /> {t('components.ReportABugSection.callToAction')}
      </button>
    </motion.div>
  );
}
