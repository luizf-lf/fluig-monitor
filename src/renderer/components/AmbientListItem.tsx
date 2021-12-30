import { FiSettings } from 'react-icons/fi';
import AmbientDataInterface from '../interfaces/AmbientDataInterface';
import SmallTag from './SmallTag';
import '../assets/styles/components/AmbientListItem.scss';

interface AmbientListItemInterface {
  data: AmbientDataInterface;
}

export default function AmbientListItem({ data }: AmbientListItemInterface) {
  return (
    <div className="ambient-item-container">
      <div className="ambient-item-row">
        <button type="button" id="ambientName">
          {data.name}
        </button>
        <button type="button">
          <FiSettings />
        </button>
      </div>
      <div className="ambient-item-row">
        {/* <span className="ambientStatusIndicator is-offline"> */}
        <span className="ambientStatusIndicator">
          <div id="indicatorDot" />
          <span id="indicatorText">online</span>
        </span>
        <span>
          <SmallTag kind={data.kind} />
        </span>
      </div>
    </div>
  );
}
