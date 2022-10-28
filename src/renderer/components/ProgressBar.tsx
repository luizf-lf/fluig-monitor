/* eslint-disable react/require-default-props */
import '../assets/styles/components/ProgressBar.scss';

interface Props {
  total: number;
  current: number;
  showValues?: boolean;
  showPercentage?: boolean;
  showIndicator?: boolean;
  gradient?: boolean;
}

export default function ProgressBar({
  total,
  current,
  showValues = false,
  showPercentage = false,
  showIndicator = true,
  gradient = true,
}: Props) {
  const percentage = (current / total) * 100;
  let bgStyle = '';

  if (!gradient) {
    if (percentage >= 70 && percentage < 90) {
      bgStyle = 'var(--yellow)';
    } else if (percentage >= 90) {
      bgStyle = 'var(--red)';
    } else {
      bgStyle = 'var(--green)';
    }
  }

  return (
    <div className="pb-container">
      {showValues ? (
        <div className="values">
          <span>0</span>
          <span>{total}</span>
        </div>
      ) : (
        <></>
      )}
      {showIndicator ? (
        <div className="indicator" style={{ width: `${percentage}%` }}>
          {showPercentage ? `${percentage}%` : current}
        </div>
      ) : (
        <></>
      )}
      <div className="progress-bar">
        <div
          className={`progress ${gradient ? 'progress-gradient' : ''}`}
          style={{ width: `${percentage}%`, backgroundColor: bgStyle }}
        />
      </div>
    </div>
  );
}
