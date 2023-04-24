import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ipcRenderer } from 'electron';

import '../../assets/styles/components/EnvironmentDataView/EnvironmentServices.scss';
import { EnvironmentServices } from '../../../common/interfaces/EnvironmentControllerInterface';
import TimeIndicator from '../TimeIndicator';
import { getEnvironmentServices } from '../../ipc/environmentsIpcHandler';
import getServiceName from '../../utils/getServiceName';

export default function EnvironmentServicesPanel() {
  const { t } = useTranslation();

  const location = useLocation();
  const environmentId = location.pathname.split('/')[2];

  const [environmentServices, setEnvironmentServices] =
    useState<EnvironmentServices | null>(null);
  const [cardData, setCardData] = useState(<></>);

  useEffect(() => {
    async function loadServicesData() {
      setEnvironmentServices(
        await getEnvironmentServices(Number(environmentId))
      );
    }

    ipcRenderer.on(`environmentDataUpdated_${environmentId}`, () => {
      loadServicesData();
    });

    loadServicesData();

    return () => {
      ipcRenderer.removeAllListeners(`environmentDataUpdated_${environmentId}`);
      setEnvironmentServices(null);
    };
  }, [environmentId]);

  useEffect(() => {
    setCardData(
      environmentServices ? (
        <>
          <div className="service-list">
            {Object.entries(environmentServices.monitorHistory[0]).map(
              (item) => {
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
              }
            )}
          </div>
          <TimeIndicator
            date={environmentServices.monitorHistory[0].httpResponse.timestamp}
          />
        </>
      ) : (
        <span>{t('components.global.noData')}</span>
      )
    );
  }, [environmentServices, t]);

  return (
    <div className="widget-container" id="environment-services">
      <h3 className="title">{t('components.EnvironmentServices.title')}</h3>
      <div className="widget-card">{cardData}</div>
    </div>
  );
}
