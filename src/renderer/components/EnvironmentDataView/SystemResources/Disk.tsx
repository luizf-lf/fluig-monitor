import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiServer } from 'react-icons/fi';
import SpinnerLoader from '../../Loaders/Spinner';
import { getHistoricalDiskInfo } from '../../../ipc/environmentsIpcHandler';
import { HDStats } from '../../../../main/controllers/StatisticsHistoryController';
import formatBytes from '../../../../common/utils/formatBytes';
import ProgressBar from '../../ProgressBar';

interface Props {
  environmentId: number;
}

export default function Disk({ environmentId }: Props) {
  const [diskInfo, setDiskInfo] = useState([{}] as HDStats[]);
  const { t } = useTranslation();

  useEffect(() => {
    async function getData() {
      setDiskInfo(await getHistoricalDiskInfo(environmentId));
    }

    getData();
  }, [environmentId]);

  if (diskInfo.length === 0) {
    return <div className="card">{t('components.global.noData')}</div>;
  }

  if (typeof diskInfo[0].systemServerHDFree === 'undefined') {
    return <SpinnerLoader />;
  }

  return (
    <div className="card system-resource-card">
      <div className="header">
        <div className="icon-dot purple-variant">
          <FiServer />
        </div>
        <span className="text-purple">
          {t('components.SystemResources.Disk.title')}
        </span>
      </div>
      <div className="body">
        <p className="font-soft">{t('components.SystemResources.Disk.used')}</p>
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
      </div>
    </div>
  );
}
