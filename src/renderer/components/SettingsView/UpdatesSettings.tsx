import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiInfo, FiPackage } from 'react-icons/fi';
import globalContainerVariants from '../../utils/globalContainerVariants';
import { getAppSetting } from '../../ipc/settingsIpcHandler';
import parseBoolean from '../../../common/utils/parseBoolean';

export default function UpdatesSettings() {
  const { t } = useTranslation();

  const [enableAutoDownload, setEnableAutoDownload] = useState(true);
  const [enableAutoInstall, setEnableAutoInstall] = useState(true);

  async function loadSettings() {
    // TODO: Use the get all as object
    const enableAutoDownloadSetting = await getAppSetting(
      'ENABLE_AUTO_DOWNLOAD_UPDATE'
    );

    if (enableAutoDownloadSetting) {
      setEnableAutoDownload(parseBoolean(enableAutoDownloadSetting.value));
    }

    const enableAutoInstallSetting = await getAppSetting(
      'ENABLE_AUTO_INSTALL_UPDATE'
    );

    if (enableAutoInstallSetting) {
      setEnableAutoInstall(parseBoolean(enableAutoInstallSetting.value));
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h3 className="icon-title">
        <span className="icon-dot yellow-variant">
          <FiPackage />
        </span>
        {t('components.UpdatesSettings.title')}
      </h3>
      <p className="mb-2">{t('components.UpdatesSettings.helperText')}</p>

      <div className="form-group mt-2">
        <label htmlFor="enableAutoDownload">
          <input
            type="checkbox"
            name="enableAutoDownload"
            id="enableAutoDownload"
            checked={enableAutoDownload}
            onChange={(event) => setEnableAutoDownload(event.target.checked)}
            style={{ marginRight: '0.5rem' }}
          />
          {t('components.UpdatesSettings.enableAutoDownload.label')}
        </label>

        <small className="font-soft">
          {t('components.UpdatesSettings.enableAutoDownload.helper')}
        </small>
      </div>

      <div className="form-group mt-2">
        <label htmlFor="enableAutoInstall">
          <input
            type="checkbox"
            name="enableAutoInstall"
            id="enableAutoInstall"
            checked={enableAutoInstall}
            onChange={(event) => setEnableAutoInstall(event.target.checked)}
            style={{ marginRight: '0.5rem' }}
            disabled={!enableAutoDownload}
          />
          {t('components.UpdatesSettings.enableAutoInstall.label')}
        </label>

        <small className="font-soft">
          {t('components.UpdatesSettings.enableAutoInstall.helper')}
        </small>
      </div>

      <p className="mt-2 font-soft">
        <FiInfo /> {t('components.UpdatesSettings.updateFrequency.helper')}
      </p>
    </motion.div>
  );
}
