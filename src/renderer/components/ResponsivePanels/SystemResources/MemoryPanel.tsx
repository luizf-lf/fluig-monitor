import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ipcRenderer } from 'electron';
import { FiServer } from 'react-icons/fi';
import log from 'electron-log';

import { MemoryStats } from '../../../../main/controllers/StatisticsHistoryController';
import { getMemoryInfo } from '../../../ipc/environmentsIpcHandler';
import formatBytes from '../../../../common/utils/formatBytes';
import SpinnerLoader from '../../Loaders/Spinner';
import ProgressBar from '../../ProgressBar';
import TimeIndicator from '../../TimeIndicator';

/**
 * Environment aware self loading memory panel component.
 *  Uses the useLocation hook to identify the current environment in view.
 * @since 0.5
 */
export default function MemoryPanel() {
  const [memoryInfo, setMemoryInfo] = useState<MemoryStats[] | null>(null);
  const { t } = useTranslation();

  const location = useLocation();
  const environmentId = location.pathname.split('/')[2];

  useEffect(() => {
    async function loadMemoryInfo() {
      log.info(
        `Loading memory data for environment ${environmentId} using the responsive component.`
      );
      setMemoryInfo(await getMemoryInfo(Number(environmentId)));
    }

    ipcRenderer.on(`environmentDataUpdated_${environmentId}`, async () => {
      setMemoryInfo(await getMemoryInfo(Number(environmentId)));
    });

    loadMemoryInfo();

    return () => {
      ipcRenderer.removeAllListeners(`environmentDataUpdated_${environmentId}`);
      setMemoryInfo(null);
    };
  }, [environmentId]);

  return (
    <div className="card system-resource-card">
      <div className="header">
        <div className="icon-dot">
          <FiServer />
        </div>
        <span className="text-green">
          {t('components.SystemResources.Memory.title')}
        </span>
      </div>
      {memoryInfo === null ? (
        <SpinnerLoader />
      ) : (
        <>
          <div className="body">
            <p className="font-soft">
              {t('components.SystemResources.Memory.used')}
            </p>
            <h3>
              {formatBytes(
                Number(memoryInfo[0].systemServerMemorySize) -
                  Number(memoryInfo[0].systemServerMemoryFree)
              )}
            </h3>
            <p className="font-soft">
              {t('components.SystemResources.Memory.outOf')}{' '}
              {formatBytes(Number(memoryInfo[0].systemServerMemorySize))}
            </p>
          </div>
          <div className="footer">
            <ProgressBar
              total={Number(memoryInfo[0].systemServerMemorySize)}
              showPercentage={false}
              showValues={false}
              current={
                Number(memoryInfo[0].systemServerMemorySize) -
                Number(memoryInfo[0].systemServerMemoryFree)
              }
              showIndicator={false}
              gradient={false}
            />

            <TimeIndicator date={memoryInfo[0].httpResponse.timestamp} />
          </div>
        </>
      )}
    </div>
  );
}
