import { Link } from 'react-router-dom';
import AmbientDataInterface from '../interfaces/AmbientDataInterface';
import SmallTag from './SmallTag';
import '../assets/styles/components/AmbientListItem.scss';

interface AmbientListItemInterface {
  data: AmbientDataInterface;
  isExpanded: boolean;
}

export default function AmbientListItem({
  data,
  isExpanded,
}: AmbientListItemInterface) {
  let ambientKindTitle = '';
  const isOnline = true; // TODO: update via props

  switch (data.kind) {
    case 'PROD':
      ambientKindTitle = 'Produção';
      break;
    case 'HML':
      ambientKindTitle = 'Homologação';
      break;
    case 'DEV':
      ambientKindTitle = 'Desenvolvimento';
      break;

    default:
      ambientKindTitle = 'Desconhecido (┬┬﹏┬┬)';
      break;
  }

  const ambientNameArray = data.name.split(' ');
  const ambientInitials =
    ambientNameArray.length === 1
      ? ambientNameArray[0].substring(0, 2).toUpperCase()
      : ambientNameArray[0].substring(0, 1) +
        ambientNameArray[1].substring(0, 1);
  const ambientTitle = `${data.name} [${
    isOnline ? 'Online' : 'Offline'
  }] [${ambientKindTitle}]`;

  if (isExpanded) {
    return (
      <Link
        to={`/ambient/${data.uuid}`}
        className="ambient-item-container is-expanded"
        title={ambientTitle}
      >
        <div className="initials">{ambientInitials}</div>
        <div className="data">
          <div>{data.name}</div>
          <div className="bottom">
            <div className={`statusIndicator${isOnline ? '' : ' is-offline'}`}>
              <div className="dot" />
              <div className="description">
                {isOnline ? 'Online' : ' Offline'}
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
      to={`/ambient/${data.uuid}`}
      className="ambient-item-container"
      title={ambientTitle}
    >
      {ambientInitials}
      <div className="ambient-indicators">
        <div className={`online-indicator${isOnline ? '' : ' is-offline'}`} />
        <div className={`kind-indicator is-${data.kind.toLowerCase()}`} />
      </div>
    </Link>
  );
}
