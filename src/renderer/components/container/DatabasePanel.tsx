import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { ipcRenderer } from 'electron';
import { FiArrowDownRight, FiArrowUpRight, FiDatabase } from 'react-icons/fi';

import { DbStatistic } from '../../../main/controllers/StatisticsHistoryController';
import { getLastDatabaseStatistic } from '../../ipc/environmentsIpcHandler';
import formatBytes from '../../../common/utils/formatBytes';
import TimeIndicator from '../base/TimeIndicator';

/**
 * Responsive and environment aware database panel component.
 *  Uses the useLocation hook to identify the current environment in view.
 * @since 0.5
 */
export default function DatabasePanel() {
  const [dbInfo, setDbInfo] = useState<DbStatistic | null>(null);
  const { t } = useTranslation();

  const location = useLocation();
  const environmentId = location.pathname.split('/')[2];

  useEffect(() => {
    async function getData() {
      setDbInfo(await getLastDatabaseStatistic(Number(environmentId)));
    }

    ipcRenderer.on(`environmentDataUpdated_${environmentId}`, async () => {
      setDbInfo(await getLastDatabaseStatistic(Number(environmentId)));
    });

    getData();

    return () => {
      ipcRenderer.removeAllListeners(`environmentDataUpdated_${environmentId}`);
    };
  }, [environmentId]);

  return (
    <div className="card system-resource-card">
      <div className="header">
        <div className="icon-dot yellow-variant">
          <FiDatabase />
        </div>
        <span className="text-yellow">
          {t('components.SystemResources.Database.title')}
        </span>
      </div>
      {dbInfo === null ? (
        <p>{t('components.global.noData')}</p>
      ) : (
        <>
          <div className="body">
            <p className="font-soft">
              {t('components.SystemResources.Database.size')}
            </p>
            <h3>{formatBytes(Number(dbInfo.dbSize))}</h3>
          </div>
          <div className="footer">
            {Number(dbInfo.dbTraficRecieved) === -1 ? (
              <p className="font-soft font-sm">
                {t('components.SystemResources.Database.trafficNotAllowed')}
              </p>
            ) : (
              <>
                <p className="font-soft">
                  {t('components.SystemResources.Database.traffic')}
                </p>
                <div className="database-traffic-container">
                  <div className="received text-green">
                    <FiArrowDownRight />
                    {formatBytes(Number(dbInfo.dbTraficRecieved))}
                  </div>
                  <div className="sent text-purple">
                    <FiArrowUpRight />
                    {formatBytes(Number(dbInfo.dbTraficSent))}
                  </div>
                </div>
              </>
            )}

            <TimeIndicator date={dbInfo.httpResponse.timestamp} />
          </div>
        </>
      )}
    </div>
  );
}
