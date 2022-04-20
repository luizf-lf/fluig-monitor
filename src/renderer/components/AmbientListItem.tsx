import { FiSettings } from 'react-icons/fi';
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

  if (isExpanded) {
    return (
      <Link
        to={`/ambient/${data.uuid}`}
        id="ambientName"
        className="ambient-item-container is-expanded"
      >
        {/* TODO: Finish styling */}
        <div>{/* logo */}</div>
        <div>
          <div>{data.name}</div>
          <div>{/* statuses */}</div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/ambient/${data.uuid}`}
      id="ambientName"
      className="ambient-item-container"
      title={`${data.name} [Online] [${ambientKindTitle}]`}
    >
      {data.name.split(' ').length === 1
        ? data.name.split(' ')[0].substring(0, 2).toUpperCase()
        : data.name.split(' ')[0].substring(0, 1) +
          data.name.split(' ')[1].substring(0, 1)}
    </Link>
  );
}
