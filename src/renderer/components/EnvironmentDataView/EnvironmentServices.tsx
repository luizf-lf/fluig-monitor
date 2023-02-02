import { useTranslation } from 'react-i18next';
import SpinnerLoader from '../Loaders/Spinner';

import '../../assets/styles/components/EnvironmentDataView/EnvironmentServices.scss';
import { MonitorHistoryWithHttpResponse } from '../../../common/interfaces/EnvironmentControllerInterface';
import TimeIndicator from '../TimeIndicator';

interface Props {
  monitors: MonitorHistoryWithHttpResponse[];
}

export default function EnvironmentServices({ monitors }: Props) {
  const { t } = useTranslation();

  if (typeof monitors === 'undefined') {
    return <SpinnerLoader />;
  }

  function getServiceName(id: string): string {
    switch (id) {
      case 'MSOffice':
        return 'MS Office';
      case 'analytics':
        return 'Analytics';
      case 'licenseServer':
        return 'License Server';
      case 'mailServer':
        return 'Mail Server';
      case 'openOffice':
        return 'Open Office';
      case 'realTime':
        return 'Fluig Realtime';
      case 'solrServer':
        return 'Solr Server';
      case 'viewer':
        return 'Fluig Viewer';
      default:
        return 'UNKNOWN';
    }
  }

  return (
    <div className="widget-container" id="environment-services">
      <h3 className="title">{t('components.EnvironmentServices.title')}</h3>
      <div className="widget-card">
        {monitors.length > 0 ? (
          <>
            <div className="service-list">
              {Object.entries(monitors[0]).map((item) => {
                let status = t('components.EnvironmentServices.failed');
                let className = 'is-failed';

                if (item[1] === 'OK') {
                  status = t('components.EnvironmentServices.operational');
                  className = 'is-operational';
                } else if (item[1] === 'NONE') {
                  status = t('components.EnvironmentServices.unused');
                  className = 'is-unused';
                }

                if (getServiceName(item[0]) !== 'UNKNOWN') {
                  return (
                    <div className="service-item" key={item[0]}>
                      <span className="service-name">
                        {getServiceName(item[0])}
                      </span>
                      <span className={`service-status ${className}`}>
                        {status} <span className="status-indicator" />
                      </span>
                    </div>
                  );
                }

                return null;
              })}
            </div>
            <TimeIndicator date={monitors[0].httpResponse.timestamp} />
          </>
        ) : (
          <span>{t('components.global.noData')}</span>
        )}
      </div>
    </div>
  );
}
