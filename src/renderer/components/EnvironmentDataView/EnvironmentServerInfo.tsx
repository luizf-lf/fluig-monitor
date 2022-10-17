import { FiClock, FiCpu, FiDatabase, FiServer } from 'react-icons/fi';
import { StatisticsHistory } from '../../../main/generated/client';
import DynamicImageLoad from '../DynamicImageLoad';
import defaultServerLogo from '../../assets/img/defaultServerLogo.png';
import SpinnerLoader from '../Loaders/Spinner';
import formatBytes from '../../../common/utils/formatBytes';

import '../../assets/styles/components/EnvironmentDataView/EnvironmentServerInfo.scss';

interface Props {
  endpoint: string;
  statistics: StatisticsHistory[];
}

export default function EnvironmentServerInfo({ endpoint, statistics }: Props) {
  if (typeof statistics === 'undefined' || typeof endpoint === 'undefined') {
    return <SpinnerLoader />;
  }

  // TODO: Finish implementation
  return (
    <div className="widget-container" id="environment-server-info">
      <h3 className="title">Servidor</h3>
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
            <div className="server-specs">
              <div className="specs-item">
                <FiCpu />
                <div className="spec-description">
                  <span>Processador</span>
                  <span>
                    {statistics[0].systemServerCoreCount}-core{' '}
                    {statistics[0].systemServerArch}
                  </span>
                </div>
              </div>
              <div className="specs-item">
                <FiServer />
                <div className="spec-description">
                  <span>Memória</span>
                  <span>
                    {formatBytes(statistics[0].systemServerMemorySize)}
                  </span>
                </div>
              </div>
              <div className="specs-item">
                <FiDatabase />
                <div className="spec-description">
                  <span>Disco</span>
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
                  <span>Tempo de atividade</span>
                  <span>{statistics[0].systemUptime}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <span>Sem Dados</span>
        )}
      </div>
    </div>
  );
}
