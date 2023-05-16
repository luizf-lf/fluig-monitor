import { shell } from 'electron';
import { motion } from 'framer-motion';
import { FiExternalLink } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

import globalContainerVariants from '../../../utils/globalContainerVariants';
import { version } from '../../../../../release/app/package.json';
import bannerLogo from '../../../assets/img/banner_logo.png';

export default function AboutSection() {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <center>
        <div className="mb-2">
          <img
            src={bannerLogo}
            alt="Fluig Monitor"
            style={{ width: '40rem' }}
            className="mb-1"
          />
          <p className="text-soft">Release {version}</p>
        </div>
        <p>{t('components.AboutSection.title')}</p>
        <p className="text-soft">
          {t('components.AboutSection.developedBy')}
          <button
            type="button"
            className="btn-subtle"
            onClick={() => shell.openExternal('https://github.com/luizf-lf')}
          >
            luizf-lf
          </button>
          .
        </p>
        <div className="mt-2">
          <p>{t('components.AboutSection.disclosure')}</p>
          <p>{t('components.AboutSection.usageDisclosure')}</p>
        </div>
        <div className="mt-2">
          <p>
            {t('components.AboutSection.learnMoreAt')}
            <button
              type="button"
              className="btn-subtle"
              onClick={() =>
                shell.openExternal('https://github.com/luizf-lf/fluig-monitor')
              }
            >
              GitHub <FiExternalLink />
            </button>
            .
          </p>
        </div>
      </center>
    </motion.div>
  );
}
