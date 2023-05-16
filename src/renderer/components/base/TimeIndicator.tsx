/* eslint-disable react/require-default-props */
import { FiClock } from 'react-icons/fi';

interface Props {
  date: Date;
  mode?: 'FULL' | 'COMPACT' | 'AUTO';
  noMargin?: boolean;
}

/**
 * Renders a time indicator string.
 * A date property is required, and will be rendered according to the mode property (defaults to 'AUTO').
 *
 * If the mode property is set to AUTO, will render a full datetime when the date is not equal to the current system date.
 */
export default function TimeIndicator({
  date,
  mode = 'AUTO',
  noMargin = false,
}: Props) {
  let dateFormat = '';

  switch (mode) {
    case 'AUTO':
      dateFormat =
        date.toLocaleDateString() === new Date().toLocaleDateString()
          ? date.toLocaleTimeString()
          : date.toLocaleString();
      break;
    case 'COMPACT':
      dateFormat = date.toLocaleTimeString();
      break;
    case 'FULL':
      dateFormat = date.toLocaleString();
      break;
    default:
      break;
  }

  return (
    <div className="time-indicator" style={noMargin ? { margin: 0 } : {}}>
      <FiClock />
      {dateFormat}
    </div>
  );
}
