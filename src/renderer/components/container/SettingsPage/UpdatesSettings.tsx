import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiInfo, FiPackage } from 'react-icons/fi';
import globalContainerVariants from '../../../utils/globalContainerVariants';
import {
  getAppSettingsAsObject,
  updateAppSettings,
} from '../../../ipc/settingsIpcHandler';
import parseBoolean from '../../../../common/utils/parseBoolean';

export default function UpdatesSettings() {
  const { t } = useTranslation();

  const [enableAutoDownload, setEnableAutoDownload] = useState(true);
  const [enableAutoInstall, setEnableAutoInstall] = useState(true);

  async function loadSettings() {
    const { ENABLE_AUTO_DOWNLOAD_UPDATE, ENABLE_AUTO_INSTALL_UPDATE } =
      await getAppSettingsAsObject();

    setEnableAutoDownload(parseBoolean(ENABLE_AUTO_DOWNLOAD_UPDATE.value));
    setEnableAutoInstall(parseBoolean(ENABLE_AUTO_INSTALL_UPDATE.value));
  }

  function handleEnableUpdateAutoInstall(checked: boolean) {
    setEnableAutoInstall(checked);
    updateAppSettings([
      {
        settingId: 'ENABLE_AUTO_INSTALL_UPDATE',
        value: String(checked),
      },
    ]);
  }

  function handleEnableUpdateAutoDownload(checked: boolean) {
    setEnableAutoDownload(checked);
    if (!checked) {
      handleEnableUpdateAutoInstall(false);
    }
    updateAppSettings([
      {
        settingId: 'ENABLE_AUTO_DOWNLOAD_UPDATE',
        value: String(checked),
      },
    ]);
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
            onChange={(event) =>
              handleEnableUpdateAutoDownload(event.target.checked)
            }
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
            onChange={(event) =>
              handleEnableUpdateAutoInstall(event.target.checked)
            }
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
