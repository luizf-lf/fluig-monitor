import { useTranslation } from 'react-i18next';
import { FiClock, FiCpu, FiDatabase, FiServer } from 'react-icons/fi';
import { StatisticsHistory } from '../../../main/generated/client';
import DynamicImageLoad from '../DynamicImageLoad';
import defaultServerLogo from '../../assets/img/defaultServerLogo.png';
import SpinnerLoader from '../Loaders/Spinner';
import formatBytes from '../../../common/utils/formatBytes';
import timeAgo from '../../../common/utils/timeAgo';

import '../../assets/styles/components/EnvironmentDataView/EnvironmentServerInfo.scss';

interface Props {
  endpoint: string;
  statistics: StatisticsHistory[];
}

export default function EnvironmentServerInfo({ endpoint, statistics }: Props) {
  const { t } = useTranslation();

  if (typeof statistics === 'undefined' || typeof endpoint === 'undefined') {
    return <SpinnerLoader />;
  }
  const uptime =
    statistics.length > 0 ? timeAgo(Number(statistics[0].systemUptime)) : null;

  return (
    <div className="widget-container" id="environment-server-info">
      <h3 className="title">{t('components.EnvironmentServerInfo.title')}</h3>
      <div className="widget-card">
        {statistics.length > 0 ? (
          <>
            <div className="image-container">
              <DynamicImageLoad
                imgSrc={`${endpoint}/portal/api/servlet/image/1/custom/logo_image.png`}
                altName="Logo"
                fallback={defaultServerLogo}
              />
            </div>
            <div id="server-specs">
              <div className="specs-item">
                <FiCpu />
                <div className="spec-description">
                  <span>{t('components.EnvironmentServerInfo.processor')}</span>
                  <span>{statistics[0].systemServerCoreCount} core</span>
                </div>
              </div>
              <div className="specs-item">
                <FiServer />
                <div className="spec-description">
                  <span>{t('components.EnvironmentServerInfo.memory')}</span>
                  <span>
                    {formatBytes(Number(statistics[0].systemServerMemorySize))}
                  </span>
                </div>
              </div>
              <div className="specs-item">
                <FiDatabase />
                <div className="spec-description">
                  <span>{t('components.EnvironmentServerInfo.disk')}</span>
                  <span>
                    {formatBytes(Number(statistics[0].systemServerHDSize))}
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
                          .replace('%minutes%', String(uptime.minutes))
                          .replace('%seconds%', String(uptime.seconds))
                      : ''}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <span>{t('components.global.noData')}</span>
        )}
      </div>
    </div>
  );
}
