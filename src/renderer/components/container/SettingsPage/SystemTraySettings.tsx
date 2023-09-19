import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiInbox } from 'react-icons/fi';

import {
  getAppSetting,
  updateAppSettings,
} from '../../../ipc/settingsIpcHandler';
import parseBoolean from '../../../../common/utils/parseBoolean';
import DefaultMotionDiv from '../../base/DefaultMotionDiv';

export default function SystemTraySettings() {
  const { t } = useTranslation();

  const [enableMinimizeFeature, setEnableMinimizeFeature] = useState(false);
  const [disableNotification, setDisableNotification] = useState(false);

  function handleEnableMinimizeFeature(checked: boolean) {
    setEnableMinimizeFeature(checked);

    updateAppSettings([
      {
        settingId: 'ENABLE_MINIMIZE_FEATURE',
        value: String(checked),
      },
    ]);
  }

  function handleDisableNotification(checked: boolean) {
    setDisableNotification(checked);

    updateAppSettings([
      {
        settingId: 'DISABLE_MINIMIZE_NOTIFICATION',
        value: String(checked),
      },
    ]);
  }

  async function loadSettings() {
    const minimizeFeatureSetting = await getAppSetting(
      'ENABLE_MINIMIZE_FEATURE'
    );

    if (minimizeFeatureSetting) {
      setEnableMinimizeFeature(parseBoolean(minimizeFeatureSetting.value));
    }

    const disableNotificationSetting = await getAppSetting(
      'DISABLE_MINIMIZE_NOTIFICATION'
    );

    if (disableNotificationSetting) {
      setDisableNotification(parseBoolean(disableNotificationSetting.value));
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <DefaultMotionDiv id="system-tray-settings">
      <h3 className="icon-title">
        <span className="icon-dot purple-variant">
          <FiInbox />
        </span>
        {t('components.SystemTraySettings.title')}
      </h3>

      <p>{t('components.SystemTraySettings.helperText')}</p>

      <div className="form-group mt-2">
        <label htmlFor="enableMinimizeToSystemTray">
          <input
            type="checkbox"
            name="enableMinimizeToSystemTray"
            id="enableMinimizeToSystemTray"
            checked={enableMinimizeFeature}
            onChange={(event) =>
              handleEnableMinimizeFeature(event.target.checked)
            }
            style={{ marginRight: '0.5rem' }}
          />
          {t('components.SystemTraySettings.minimizeToSystemTray')}
        </label>

        <small className="font-soft">
          {t('components.SystemTraySettings.minimizeToSystemTrayHelper')}
        </small>
      </div>

      <div className="form-group mt-2">
        <label htmlFor="disableNotification">
          <input
            type="checkbox"
            name="disableNotification"
            id="disableNotification"
            checked={disableNotification}
            onChange={(event) =>
              handleDisableNotification(event.target.checked)
            }
            style={{ marginRight: '0.5rem' }}
          />
          {t('components.SystemTraySettings.disableNotification')}
        </label>

        <small className="font-soft">
          {t('components.SystemTraySettings.disableNotificationHelper')}
        </small>
      </div>
    </DefaultMotionDiv>
  );
}
