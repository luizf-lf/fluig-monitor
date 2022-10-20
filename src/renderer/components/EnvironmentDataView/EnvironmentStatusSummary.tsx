import '../../assets/styles/components/EnvironmentDataView/EnvironmentStatusSummary.scss';

interface Props {
  environmentName: string;
}

export default function EnvironmentStatusSummary({ environmentName }: Props) {
  return (
    <div className="environment-status-summary-container">
      <h3 className="title">{environmentName}</h3>
      <div className="components-container">
        <div className="card">status</div>
        <div className="card">disk</div>
        <div className="card">memory</div>
        <div className="card">database</div>
      </div>
    </div>
  );
}
