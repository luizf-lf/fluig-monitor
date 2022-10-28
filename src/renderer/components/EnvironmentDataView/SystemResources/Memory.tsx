import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiServer } from 'react-icons/fi';
import ProgressBar from '../../ProgressBar';
import SpinnerLoader from '../../Loaders/Spinner';
import { getHistoricalMemoryInfo } from '../../../ipc/environmentsIpcHandler';
import { MemoryStats } from '../../../../main/controllers/StatisticsHistoryController';
import formatBytes from '../../../../common/utils/formatBytes';

interface Props {
  environmentId: number;
}

export default function Memory({ environmentId }: Props) {
  const [memoryInfo, setMemoryInfo] = useState([{}] as MemoryStats[]);
  const { t } = useTranslation();

  useEffect(() => {
    async function getData() {
      setMemoryInfo(await getHistoricalMemoryInfo(environmentId));
    }

    getData();
  }, [environmentId]);

  if (memoryInfo.length === 0) {
    return <div className="card">{t('components.global.noData')}</div>;
  }

  if (typeof memoryInfo[0].systemServerMemorySize === 'undefined') {
    return <SpinnerLoader />;
  }

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
      </div>
    </div>
  );
}
