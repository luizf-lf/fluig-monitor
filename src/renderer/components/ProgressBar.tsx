import '../assets/styles/components/ProgressBar.scss';

export default function ProgressBar({
  total,
  current,
  showValues,
}: {
  total: number;
  current: number;
  showValues: boolean;
}) {
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
        {current}
      </div>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
