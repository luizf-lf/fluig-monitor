import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FiActivity, FiWifi, FiWifiOff } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { ipcRenderer } from 'electron';

import { getLastHttpResponseById } from '../../ipc/environmentsIpcHandler';
import { HTTPResponse } from '../../../main/generated/client';

import '../../assets/styles/components/EnvironmentAvailabilityPanel.scss';
import TimeIndicator from '../base/TimeIndicator';

/**
 * Self loading environment availability panel.
 * @since 0.5
 */
export default function EnvironmentAvailabilityPanel() {
  const { t } = useTranslation();

  const location = useLocation();
  const environmentId = location.pathname.split('/')[2];
  const [statusBody, setStatusBody] = useState(<></>);
  const [lastHttpResponse, setLastHttpResponse] = useState<HTTPResponse | null>(
    null
  );

  useEffect(() => {
    async function loadData() {
      setLastHttpResponse(await getLastHttpResponseById(Number(environmentId)));
    }

    ipcRenderer.on(`serverPinged_${environmentId}`, () => {
      loadData();
    });

    loadData();
    return () => {
      ipcRenderer.removeAllListeners(`serverPinged_${environmentId}`);
      setLastHttpResponse(null);
    };
  }, [environmentId]);

  useEffect(() => {
    if (lastHttpResponse && lastHttpResponse.statusCode !== 0) {
      if (lastHttpResponse.responseTimeMs > 1000) {
        setStatusBody(
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
        setStatusBody(
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
        setStatusBody(
          <>
            <div className="status-message">
              <h3 className="text-yellow">
                {t('components.EnvironmentStatusCard.attention')}
              </h3>
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
      setStatusBody(
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
  }, [lastHttpResponse, t]);

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
        {lastHttpResponse === null ? (
          <p>{t('components.global.noData')}</p>
        ) : (
          <>
            {lastHttpResponse.statusCode !== 0 ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>
                  {t('components.EnvironmentStatusCard.responseTime').replace(
                    '%responseTime%',
                    String(lastHttpResponse.responseTimeMs)
                  )}
                </span>
                <TimeIndicator date={lastHttpResponse.timestamp} noMargin />
              </div>
            ) : (
              <span className="text-red">{lastHttpResponse.statusMessage}</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
