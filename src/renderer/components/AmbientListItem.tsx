import { FiSettings } from 'react-icons/fi';
import AmbientDataInterface from '../interfaces/AmbientDataInterface';
import SmallTag from './SmallTag';

interface AmbientListItemInterface {
  data: AmbientDataInterface;
}

export default function AmbientListItem({ data }: AmbientListItemInterface) {
  return (
    <div className="ambient-item-container">
      <div>
        <button type="button">{data.name}</button>
        <button type="button">
          <FiSettings />
        </button>
      </div>
      <div>
        <span>status</span>
        <span>
          <SmallTag kind={data.kind} />
        </span>
      </div>
    </div>
  );
}
