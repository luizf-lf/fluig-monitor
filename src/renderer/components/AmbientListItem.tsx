import { FiSettings } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import AmbientDataInterface from '../interfaces/AmbientDataInterface';
import SmallTag from './SmallTag';
import '../assets/styles/components/AmbientListItem.scss';

interface AmbientListItemInterface {
  data: AmbientDataInterface;
}

export default function AmbientListItem({ data }: AmbientListItemInterface) {
  let ambientKindTitle = '';

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
      ambientKindTitle = 'Desconhecido';
      break;
  }
  return (
    <div className="ambient-item-container">
      <div className="ambient-item-row">
        <Link to={`/ambient/${data.uuid}`} id="ambientName">
          {data.name}
        </Link>
        <Link to={`/ambient/${data.uuid}/edit`}>
          <FiSettings />
        </Link>
      </div>
      <div className="ambient-item-row">
        {/* <span className="ambientStatusIndicator is-offline"> */}
        <span className="ambientStatusIndicator">
          <div id="indicatorDot" />
          <span id="indicatorText">online</span>
        </span>
        <span title={ambientKindTitle}>
          <SmallTag kind={data.kind} />
        </span>
      </div>
    </div>
  );
}
