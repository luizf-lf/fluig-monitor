import { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiClock, FiCpu, FiDatabase, FiServer } from 'react-icons/fi';

import DynamicImageLoad from '../base/DynamicImageLoad';
import defaultServerLogo from '../../assets/img/defaultServerLogo.png';
import formatBytes from '../../../common/utils/formatBytes';
import relativeTime from '../../../common/utils/relativeTime';
import { EnvironmentServerData } from '../../../common/interfaces/EnvironmentControllerInterface';
import { getEnvironmentServerData } from '../../ipc/environmentsIpcHandler';

import '../../assets/styles/components/EnvironmentServerInfo.scss';

export default function EnvironmentServerInfo() {
  const { t } = useTranslation();
  const [serverData, setServerData] = useState<EnvironmentServerData | null>(
    null
  );

  const [cardData, setCardData] = useState(<></>);

  const location = useLocation();
  const environmentId = location.pathname.split('/')[2];

  useEffect(() => {
    async function loadServerData() {
      setServerData(await getEnvironmentServerData(Number(environmentId)));
    }

    ipcRenderer.on(`environmentDataUpdated_${environmentId}`, () => {
      loadServerData();
    });

    loadServerData();

    return () => {
      ipcRenderer.removeAllListeners(`environmentDataUpdated_${environmentId}`);
      setServerData(null);
    };
  }, [environmentId]);

  useEffect(() => {
    const uptime =
      serverData &&
      serverData.statisticHistory.length > 0 &&
      serverData.statisticHistory[0].systemUptime
        ? relativeTime(Number(serverData.statisticHistory[0].systemUptime))
        : null;

    setCardData(
      serverData ? (
        <>
          <div className="image-container">
            <DynamicImageLoad
              imgSrc={`${serverData.baseUrl}/portal/api/servlet/image/1/custom/logo_image.png`}
              altName="Logo"
              fallback={defaultServerLogo}
            />
          </div>
          {uptime != null ? (
            <>
              <div id="server-specs">
                <div className="specs-item">
                  <FiCpu />
                  <div className="spec-description">
                    <span>
                      {t('components.EnvironmentServerInfo.processor')}
                    </span>
                    <span>
                      {serverData.statisticHistory[0].systemServerCoreCount}{' '}
                      core
                    </span>
                  </div>
                </div>
                <div className="specs-item">
                  <FiServer />
                  <div className="spec-description">
                    <span>{t('components.EnvironmentServerInfo.memory')}</span>
                    <span>
                      {formatBytes(
                        Number(
                          serverData.statisticHistory[0].systemServerMemorySize
                        )
                      )}
                    </span>
                  </div>
                </div>
                <div className="specs-item">
                  <FiDatabase />
                  <div className="spec-description">
                    <span>{t('components.EnvironmentServerInfo.disk')}</span>
                    <span>
                      {formatBytes(
                        Number(
                          serverData.statisticHistory[0].systemServerHDSize
                        )
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div id="uptime">
                <div className="specs-item">
                  <FiClock />
                  <div className="spec-description">
                    <span>
                      {t('components.EnvironmentServerInfo.activityTime')}
                    </span>
                    <span>
                      {uptime !== null
                        ? t(
                            'components.EnvironmentServerInfo.activityTimeDescription'
                          )
                            .replace('%days%', String(uptime.days))
                            .replace('%hours%', String(uptime.hours))
                            .replace('%minutes%', String(uptime.minutes))
                            .replace('%seconds%', String(uptime.seconds))
                        : ''}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <span className="text-soft">
                {t('components.EnvironmentServerInfo.noDataDueToVersion')}
              </span>
            </div>
          )}
        </>
      ) : (
        <span>{t('components.global.noData')}</span>
      )
    );
  }, [serverData, t]);

  return (
    <div className="widget-container" id="environment-server-info">
      <h3 className="title">{t('components.EnvironmentServerInfo.title')}</h3>
      <div className="widget-card">{cardData}</div>
    </div>
  );
}
