/* eslint-disable react/require-default-props */
import '../assets/styles/components/ProgressBar.scss';

interface Props {
  total: number;
  current: number;
  showValues?: boolean;
  showPercentage?: boolean;
}

export default function ProgressBar({
  total,
  current,
  showValues = false,
  showPercentage = false,
}: Props) {
  const percentage = (current / total) * 100;

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
      <div className="indicator" style={{ width: `${percentage}%` }}>
        {showPercentage ? `${percentage}%` : current}
      </div>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
