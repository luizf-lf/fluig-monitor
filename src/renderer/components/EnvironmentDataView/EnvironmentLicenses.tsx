import { useTranslation } from 'react-i18next';
import { FiClock } from 'react-icons/fi';
import { LicenseHistoryWithHttpResponse } from '../../../common/interfaces/EnvironmentControllerInterface';
import SpinnerLoader from '../Loaders/Spinner';
import ProgressBar from '../ProgressBar';

interface Props {
  licenses: LicenseHistoryWithHttpResponse[];
}

export default function EnvironmentLicenses({ licenses }: Props) {
  const { t } = useTranslation();

  if (typeof licenses === 'undefined') {
    return <SpinnerLoader />;
  }

  return (
    <div className="widget-container">
      <h3 className="title">{t('components.EnvironmentLicenses.title')}</h3>
      <div className="widget-card">
        {licenses.length > 0 ? (
          <>
            <span>
              {t('components.EnvironmentLicenses.usedLicenses')
                .replace('%active%', String(licenses[0].activeUsers))
                .replace('%total%', String(licenses[0].totalLicenses))}
            </span>
            <br />
            <span style={{ fontSize: '0.75rem' }}>
              {t('components.EnvironmentLicenses.remainingLicenses').replace(
                '%remaining%',
                String(licenses[0].remainingLicenses)
              )}
            </span>
            <ProgressBar
              total={
                licenses[0].totalLicenses === 0
                  ? licenses[0].activeUsers
                  : licenses[0].totalLicenses
              }
              current={licenses[0].activeUsers}
              showPercentage
            />

            {/* TODO: Only show time sync indicators when the last sync was on the previous day */}
            <div className="sync-time-indicator">
              <FiClock />
              {licenses[0].httpResponse.timestamp.toLocaleTimeString()}
            </div>
          </>
        ) : (
          <span>{t('components.global.noData')}</span>
        )}
      </div>
    </div>
  );
}
