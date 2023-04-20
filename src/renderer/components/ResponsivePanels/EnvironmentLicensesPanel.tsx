import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { ipcRenderer } from 'electron';

import ProgressBar from '../ProgressBar';
import TimeIndicator from '../TimeIndicator';
import { EnvironmentLicenseData } from '../../../main/controllers/LicenseHistoryController';
import { getLastEnvironmentLicenseData } from '../../ipc/environmentsIpcHandler';

/**
 * Self loading environment license panel. Uses the current environment id to load the license data.
 * @since 0.1.3
 */
export default function EnvironmentLicensesPanel() {
  const { t } = useTranslation();

  const [licenses, setLicenses] = useState<EnvironmentLicenseData | null>(null);

  const location = useLocation();
  const environmentId = location.pathname.split('/')[2];

  useEffect(() => {
    async function loadLicenseData() {
      setLicenses(await getLastEnvironmentLicenseData(Number(environmentId)));
    }

    ipcRenderer.on(`environmentDataUpdated_${environmentId}`, () => {
      loadLicenseData();
    });

    loadLicenseData();
    return () => {
      ipcRenderer.removeAllListeners(`environmentDataUpdated_${environmentId}`);
      setLicenses(null);
    };
  }, [environmentId]);

  return (
    <div className="widget-container">
      <h3 className="title">{t('components.EnvironmentLicenses.title')}</h3>
      <div className="widget-card">
        {licenses === null ? (
          <span>{t('components.global.noData')}</span>
        ) : (
          <>
            <span>
              {t('components.EnvironmentLicenses.usedLicenses')
                .replace('%active%', String(licenses.activeUsers))
                .replace('%total%', String(licenses.totalLicenses))}
            </span>
            <br />
            <span style={{ fontSize: '0.75rem' }}>
              {t('components.EnvironmentLicenses.remainingLicenses').replace(
                '%remaining%',
                String(licenses.remainingLicenses)
              )}
            </span>
            <ProgressBar
              total={
                licenses.totalLicenses === 0
                  ? licenses.activeUsers
                  : licenses.totalLicenses
              }
              current={licenses.activeUsers}
              showPercentage
            />

            <TimeIndicator date={licenses.httpResponse.timestamp} />
          </>
        )}
      </div>
    </div>
  );
}
