import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiDatabase } from 'react-icons/fi';

import DefaultMotionDiv from '../../base/DefaultMotionDiv';
import {
  getAppSettingsAsObject,
  updateAppSettings,
} from '../../../ipc/settingsIpcHandler';

export default function PersistenceThresholdSection() {
  const { t } = useTranslation();
  const [persistenceThreshold, setPersistenceThreshold] = useState(0);
  const [changeTimeout, setChangeTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const handlePersistenceThresholdChange = (value: string) => {
    if (changeTimeout) {
      clearTimeout(changeTimeout);
      setChangeTimeout(null);
    }

    setChangeTimeout(
      setTimeout(() => {
        updateAppSettings([
          {
            settingId: 'PERSISTENCE_THRESHOLD',
            value,
          },
        ]);
      }, 1000)
    );

    setPersistenceThreshold(Number(value));
  };

  const loadSettings = async () => {
    const { PERSISTENCE_THRESHOLD } = await getAppSettingsAsObject();
    setPersistenceThreshold(Number(PERSISTENCE_THRESHOLD.value));
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <DefaultMotionDiv id="persistence-threshold-settings">
      <h3 className="icon-title">
        <span className="icon-dot green-variant">
          <FiDatabase />
        </span>
        {t('components.PersistenceThresholdSection.title')}
      </h3>
      <p className="mb-2">
        {t('components.PersistenceThresholdSection.description')}
      </p>

      <div className="form-group mt-2">
        <label htmlFor="persistenceThreshold">
          {t('components.PersistenceThresholdSection.label')}
          <input
            id="persistenceThreshold"
            name="persistenceThreshold"
            className="form-input ml-1"
            type="number"
            min="0"
            value={persistenceThreshold}
            onChange={(event) =>
              handlePersistenceThresholdChange(event.target.value)
            }
          />
        </label>

        <small className="font-soft">
          {t('components.PersistenceThresholdSection.helper')}
        </small>
      </div>
    </DefaultMotionDiv>
  );
}
