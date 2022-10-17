import { MonitorHistory } from '../../../main/generated/client';
import DynamicImageLoad from '../DynamicImageLoad';
import defaultServerLogo from '../../assets/img/defaultServerLogo.png';

interface Props {
  endpoint: string;
  monitors: MonitorHistory[];
}

export default function EnvironmentServerInfo({ endpoint, monitors }: Props) {
  // TODO: Finish implementation
  return (
    <div className="widget-container">
      <h3 className="title">Servidor</h3>
      <div className="widget-card">
        <DynamicImageLoad
          imgSrc={`${endpoint}/portal/api/servlet/image/1/custom/logo_image.png`}
          altName="Logo"
          fallback={defaultServerLogo}
        />
        <div id="server-specs"></div>
        <div id="uptime"></div>
      </div>
    </div>
  );
}
