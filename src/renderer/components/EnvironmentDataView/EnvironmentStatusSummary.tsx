import '../../assets/styles/components/EnvironmentDataView/EnvironmentStatusSummary.scss';
import EnvironmentStatusCard from './EnvironmentStatusCard';

interface Props {
  environmentName: string;
  environmentId: number;
}

export default function EnvironmentStatusSummary({
  environmentName,
  environmentId,
}: Props) {
  return (
    <div className="environment-status-summary-container">
      <h3 className="title">{environmentName}</h3>
      <div className="components-container">
        <EnvironmentStatusCard environmentId={environmentId} />
        <div className="card">disk</div>
        <div className="card">memory</div>
        <div className="card">database</div>
      </div>
    </div>
  );
}
