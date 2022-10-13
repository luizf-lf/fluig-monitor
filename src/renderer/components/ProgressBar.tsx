import '../assets/styles/components/ProgressBar.scss';

export default function ProgressBar({
  total,
  current,
}: {
  total: number;
  current: number;
}) {
  const percentage = (current / total) * 100;

  // TODO: Finish component
  return (
    <div className="pb-container">
      <div className="values">
        <span style={{ transform: 'translateX(10px)', fontWeight: 'bold' }}>
          {current}
        </span>
        <span>{total}</span>
      </div>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
