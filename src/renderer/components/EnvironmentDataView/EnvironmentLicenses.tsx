import { LicenseHistory } from '../../../main/generated/client';
import SpinnerLoader from '../Loaders/Spinner';
import ProgressBar from '../ProgressBar';

export default function EnvironmentLicenses({
  licenses,
}: {
  licenses: LicenseHistory[];
}) {
  if (typeof licenses === 'undefined') {
    return <SpinnerLoader />;
  }

  const { activeUsers, remainingLicenses, totalLicenses } = licenses[0];

  return (
    <div className="widget-container">
      <h3 className="title">Licenças</h3>
      <div className="widget-card">
        <span style={{ fontSize: '0.75rem' }}>
          {activeUsers} usadas, {totalLicenses} disponíveis, {remainingLicenses}{' '}
          restantes.
        </span>
        <ProgressBar total={totalLicenses} current={activeUsers} />
      </div>
    </div>
  );
}
