import { useEffect, useState } from 'react';
import SpinnerLoader from '../../Loaders/Spinner';
import { getHistoricalDiskInfo } from '../../../ipc/environmentsIpcHandler';
import { HDStats } from '../../../../main/controllers/StatisticsHistoryController';

interface Props {
  environmentId: number;
}

export default function Disk({ environmentId }: Props) {
  const [diskInfo, setDiskInfo] = useState([{}] as HDStats[]);
  // const { t } = useTranslation();

  useEffect(() => {
    async function getData() {
      setDiskInfo(await getHistoricalDiskInfo(environmentId));
    }

    getData();
  }, [environmentId]);

  if (diskInfo.length === 0) {
    return <div className="card">No Data</div>;
  }

  if (typeof diskInfo[0].systemServerHDFree === 'undefined') {
    return <SpinnerLoader />;
  }

  return <div className="card">Disk</div>;
}
