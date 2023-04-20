import { FiActivity, FiWifi, FiWifiOff } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { EnvironmentWithHistory } from '../../../common/interfaces/EnvironmentControllerInterface';

import '../../assets/styles/components/EnvironmentDataView/EnvironmentStatusCard.scss';

interface Props {
  environment: EnvironmentWithHistory;
}

// TODO: Update to the self loading strategy
export default function EnvironmentStatusCard({ environment }: Props) {
  const { t } = useTranslation();
  const lastResponse =
    environment.httpResponses[environment.httpResponses.length - 1];
  let statusBody = <></>;

  if (lastResponse.statusCode !== 0) {
    if (lastResponse.responseTimeMs > 1000) {
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
    } else if (lastResponse.statusCode === 200) {
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
            <h3 className="text-yellow">
              {t('components.EnvironmentStatusCard.attention')}
            </h3>
            <span className="text-secondary">
              {t(
                'components.EnvironmentStatusCard.noSatisfactoryResponse'
              ).replace('%http%', String(lastResponse.statusCode))}
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
        {lastResponse.statusCode !== 0 ? (
          <span>
            {t('components.EnvironmentStatusCard.responseTime').replace(
              '%responseTime%',
              String(lastResponse.responseTimeMs)
            )}
          </span>
        ) : (
          <span className="text-red">{lastResponse.statusMessage}</span>
        )}
      </div>
    </div>
  );
}
