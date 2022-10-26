import { useEffect, useState } from 'react';
import { FiActivity, FiWifi, FiWifiOff } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { HTTPResponse } from '../../../main/generated/client';
import { getLastHttpResponseById } from '../../ipc/environmentsIpcHandler';

import '../../assets/styles/components/EnvironmentDataView/EnvironmentStatusCard.scss';

interface Props {
  environmentId: number;
}

export default function EnvironmentStatusCard({ environmentId }: Props) {
  const [lastHttpResponse, setLastHttpResponse] = useState({} as HTTPResponse);
  const { t } = useTranslation();
  let statusBody = <></>;

  useEffect(() => {
    async function getData() {
      setLastHttpResponse(await getLastHttpResponseById(environmentId));
    }

    getData();
  }, [environmentId]);

  if (lastHttpResponse.statusCode !== 0) {
    if (lastHttpResponse.responseTimeMs > 1000) {
      statusBody = (
        <>
          <div className="status-message">
            <h3 className="text-yellow">
              {t('components.EnvironmentStatusCard.attention')}
            </h3>
            <span className="text-secondary">
              {t('components.EnvironmentStatusCard.highResponseTime')}
            </span>
          </div>
          <div className="status-icon has-warning">
            <FiWifi />
          </div>
        </>
      );
    } else if (lastHttpResponse.statusCode === 200) {
      statusBody = (
        <>
          <div className="status-message">
            <h3 className="text-green">
              {t('components.EnvironmentStatusCard.operational')}
            </h3>
            <span className="text-secondary ">
              {t('components.EnvironmentStatusCard.operatingCorrectly')}
            </span>
          </div>
          <div className="status-icon breathe">
            <FiWifi />
          </div>
        </>
      );
    } else {
      statusBody = (
        <>
          <div className="status-message">
            <h3 className="text-yellow">Atenção</h3>
            <span className="text-secondary">
              {t(
                'components.EnvironmentStatusCard.noSatisfactoryResponse'
              ).replace('%http%', String(lastHttpResponse.statusCode))}
            </span>
          </div>
          <div className="status-icon has-warning">
            <FiWifi />
          </div>
        </>
      );
    }
  } else {
    statusBody = (
      <>
        <div className="status-message">
          <h3 className="text-red">
            {t('components.EnvironmentStatusCard.unavailable')}
          </h3>
          <span className="text-secondary">
            {t('components.EnvironmentStatusCard.mayBeOffline')}
          </span>
        </div>
        <div className="status-icon has-danger">
          <FiWifiOff />
        </div>
      </>
    );
  }

  return (
    <div className="card environment-status-card">
      <div className="header">
        <div className="icon-dot red-variant">
          <FiActivity />
        </div>
        <span className="text-red">
          {t('components.EnvironmentStatusCard.title')}
        </span>
      </div>
      <div className="body">{statusBody}</div>
      <div className="footer">
        {lastHttpResponse.statusCode !== 0 ? (
          <span>
            {t('components.EnvironmentStatusCard.responseTime').replace(
              '%responseTime%',
              String(lastHttpResponse.responseTimeMs)
            )}
          </span>
        ) : (
          <span className="text-red">{lastHttpResponse.statusMessage}</span>
        )}
      </div>
    </div>
  );
}
