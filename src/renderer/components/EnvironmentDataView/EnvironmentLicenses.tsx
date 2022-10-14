import { useTranslation } from 'react-i18next';
import { LicenseHistory } from '../../../main/generated/client';
import SpinnerLoader from '../Loaders/Spinner';
import ProgressBar from '../ProgressBar';

interface Props {
  licenses: LicenseHistory[];
}

export default function EnvironmentLicenses({ licenses }: Props) {
  const { t } = useTranslation();

  if (typeof licenses === 'undefined') {
    return <SpinnerLoader />;
  }

  const { activeUsers, remainingLicenses, totalLicenses } = licenses[0];

  return (
    <div className="widget-container">
      <h3 className="title">{t('components.EnvironmentLicenses.title')}</h3>
      <div className="widget-card">
        <span>
          {t('components.EnvironmentLicenses.usedLicenses')
            .replace('%active%', String(activeUsers))
            .replace('%total%', String(totalLicenses))}
        </span>
        <br />
        <span style={{ fontSize: '0.75rem' }}>
          {t('components.EnvironmentLicenses.remainingLicenses').replace(
            '%remaining%',
            String(remainingLicenses)
          )}
        </span>
        <ProgressBar
          total={totalLicenses === 0 ? activeUsers : totalLicenses}
          current={activeUsers}
          showPercentage
        />
      </div>
    </div>
  );
}
