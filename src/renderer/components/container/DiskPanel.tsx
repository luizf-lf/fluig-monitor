import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { FiHardDrive } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { ipcRenderer } from 'electron';
import log from 'electron-log';

import formatBytes from '../../../common/utils/formatBytes';
import { HDStats } from '../../../main/controllers/StatisticsHistoryController';
import { getDiskInfo } from '../../ipc/environmentsIpcHandler';
import SpinnerLoader from '../base/Loaders/Spinner';
import ProgressBar from '../base/ProgressBar';
import TimeIndicator from '../base/TimeIndicator';

/**
 * Environment aware self loading disk usage panel component.
 *  Uses the useLocation hook to identify the current environment in view.
 * @since 0.5
 */
function DiskPanel() {
  const [diskInfo, setDiskInfo] = useState<HDStats[] | null>(null);
  const location = useLocation();
  const { t } = useTranslation();
  const environmentId = location.pathname.split('/')[2];

  useEffect(() => {
    async function loadDiskInfo() {
      log.info(
        `Loading disk data for environment ${environmentId} using the responsive component.`
      );

      const result = await getDiskInfo(Number(environmentId));
      setDiskInfo(result);
    }

    ipcRenderer.on(`environmentDataUpdated_${environmentId}`, async () => {
      setDiskInfo(await getDiskInfo(Number(environmentId)));
    });

    loadDiskInfo();
    return () => {
      ipcRenderer.removeAllListeners(`environmentDataUpdated_${environmentId}`);
      setDiskInfo(null);
    };
  }, [environmentId]);

  return (
    <div className="card system-resource-card">
      <div className="header">
        <div className="icon-dot purple-variant">
          <FiHardDrive />
        </div>
        <span className="text-purple">
          {t('components.SystemResources.Disk.title')}
        </span>
      </div>
      {diskInfo === null ? (
        <SpinnerLoader />
      ) : (
        <>
          {diskInfo.length === 0 ? (
            <p>{t('components.global.noData')}</p>
          ) : (
            <>
              <div className="body">
                <p className="font-soft">
                  {t('components.SystemResources.Disk.used')}
                </p>
                <h3>
                  {formatBytes(
                    Number(diskInfo[0].systemServerHDSize) -
                      Number(diskInfo[0].systemServerHDFree)
                  )}
                </h3>
                <p className="font-soft">
                  {t('components.SystemResources.Disk.outOf')}{' '}
                  {formatBytes(Number(diskInfo[0].systemServerHDSize))}
                </p>
              </div>
              <div className="footer">
                <ProgressBar
                  total={Number(diskInfo[0].systemServerHDSize)}
                  showPercentage={false}
                  showValues={false}
                  current={
                    Number(diskInfo[0].systemServerHDSize) -
                    Number(diskInfo[0].systemServerHDFree)
                  }
                  showIndicator={false}
                  gradient={false}
                />

                <TimeIndicator date={diskInfo[0].httpResponse.timestamp} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default DiskPanel;
