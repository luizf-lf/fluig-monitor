import { useState } from 'react';
import { ipcRenderer } from 'electron';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SmallTag from '../SmallTag';
import { Environment } from '../../../main/generated/client';
import '../../assets/styles/components/EnvironmentListItem.scss';

interface EnvironmentListItemInterface {
  data: Environment;
  isExpanded: boolean;
}

export default function EnvironmentListItem({
  data,
  isExpanded,
}: EnvironmentListItemInterface) {
  let environmentKindTitle = '';
  const [isOnline, setIsOnline] = useState(true);
  const { t } = useTranslation();

  ipcRenderer.on(`serverPinged_${data.id}`, (_event, { serverIsOnline }) => {
    setIsOnline(serverIsOnline);
  });

  switch (data.kind) {
    case 'PROD':
      environmentKindTitle = t('global.environmentKinds.PROD');
      break;
    case 'HML':
      environmentKindTitle = t('global.environmentKinds.HML');
      break;
    case 'DEV':
      environmentKindTitle = t('global.environmentKinds.DEV');
      break;

    default:
      environmentKindTitle = 'Desconhecido (┬┬﹏┬┬)';
      break;
  }

  const environmentNameArray = data.name.split(' ');
  const environmentInitials =
    environmentNameArray.length === 1
      ? environmentNameArray[0].substring(0, 2).toUpperCase()
      : environmentNameArray[0].substring(0, 1) +
        environmentNameArray[1].substring(0, 1);
  const environmentTitle = `${data.name} [${
    isOnline ? 'Online' : 'Offline'
  }] [${environmentKindTitle}]`;

  if (isExpanded) {
    return (
      <Link
        to={`/environment/${data.id}/summary`}
        className="environment-item-container is-expanded"
        title={environmentTitle}
      >
        <div className="initials">{environmentInitials}</div>
        <div className="data">
          <div>{data.name}</div>
          <div className="bottom">
            <div className={`statusIndicator${isOnline ? '' : ' is-offline'}`}>
              <div className="dot" />
              <div className="description">
                {isOnline ? 'Online' : 'Offline'}
              </div>
            </div>
            <SmallTag kind={data.kind} />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/environment/${data.id}/summary`}
      className="environment-item-container"
      title={environmentTitle}
    >
      {environmentInitials}
      <div className="environment-indicators">
        <div className={`online-indicator${isOnline ? '' : ' is-offline'}`} />
        <div className={`kind-indicator is-${data.kind.toLowerCase()}`} />
      </div>
    </Link>
  );
}
