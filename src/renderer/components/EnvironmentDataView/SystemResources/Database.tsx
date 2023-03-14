import { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { useTranslation } from 'react-i18next';
import { FiArrowDownRight, FiArrowUpRight, FiDatabase } from 'react-icons/fi';
import SpinnerLoader from '../../Loaders/Spinner';
import { getDatabaseInfo } from '../../../ipc/environmentsIpcHandler';
import { DBStats } from '../../../../main/controllers/StatisticsHistoryController';
import formatBytes from '../../../../common/utils/formatBytes';
import TimeIndicator from '../../TimeIndicator';

interface Props {
  environmentId: number;
}

export default function Database({ environmentId }: Props) {
  const [dbInfo, setDbInfo] = useState([] as DBStats[]);
  const { t } = useTranslation();

  useEffect(() => {
    async function getData() {
      setDbInfo(await getDatabaseInfo(environmentId));
    }

    ipcRenderer.on(`environmentDataUpdated_${environmentId}`, async () => {
      setDbInfo(await getDatabaseInfo(environmentId));
    });

    getData();

    return () => {
      ipcRenderer.removeAllListeners(`environmentDataUpdated_${environmentId}`);
    };
  }, [environmentId]);

  if (dbInfo.length === 0) {
    return <div className="card">{t('components.global.noData')}</div>;
  }

  if (typeof dbInfo[0].dbSize === 'undefined') {
    return <SpinnerLoader />;
  }

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
      <div className="body">
        <p className="font-soft">
          {t('components.SystemResources.Database.size')}
        </p>
        <h3>{formatBytes(Number(dbInfo[0].dbSize))}</h3>
      </div>
      <div className="footer">
        {Number(dbInfo[0].dbTraficRecieved) === -1 ? (
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
                {formatBytes(Number(dbInfo[0].dbTraficRecieved))}
              </div>
              <div className="sent text-purple">
                <FiArrowUpRight />
                {formatBytes(Number(dbInfo[0].dbTraficSent))}
              </div>
            </div>
          </>
        )}

        <TimeIndicator date={dbInfo[0].httpResponse.timestamp} />
      </div>
    </div>
  );
}
