import { useTranslation } from 'react-i18next';
import { EnvironmentWithHistory } from '../../../common/interfaces/EnvironmentControllerInterface';
import EnvironmentStatusCard from './EnvironmentStatusCard';
import SpinnerLoader from '../Loaders/Spinner';

import '../../assets/styles/components/EnvironmentDataView/EnvironmentStatusSummary.scss';

import Disk from './SystemResources/Disk';
import Database from './SystemResources/Database';
import Memory from './SystemResources/Memory';

interface Props {
  environment: EnvironmentWithHistory;
}

export default function EnvironmentStatusSummary({ environment }: Props) {
  const { t } = useTranslation();

  if (typeof environment.httpResponses === 'undefined') {
    return <SpinnerLoader />;
  }

  if (environment.httpResponses.length === 0) {
    return (
      <div className="environment-status-summary-container">
        <h2 className="title">{environment.name}</h2>
        <div className="components-container">
          <div className="card">{t('components.global.noData')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="environment-status-summary-container">
      <h2 className="title">
        {environment.name}
        {environment.httpResponses[0].timestamp.toDateString() ===
        new Date().toDateString() ? (
          <span>
            {t('components.EnvironmentStatusSummary.updatedAt')}{' '}
            {environment.httpResponses[0].timestamp.toLocaleTimeString()}
          </span>
        ) : (
          <span>
            {t('components.EnvironmentStatusSummary.updatedAtAlt')}{' '}
            {environment.httpResponses[0].timestamp.toLocaleString()}
          </span>
        )}
      </h2>
      <div className="components-container">
        <EnvironmentStatusCard environment={environment} />
        <div className="system-resources">
          <Disk environmentId={environment.id} />
          <Memory environmentId={environment.id} />
          <Database environmentId={environment.id} />
        </div>
      </div>
    </div>
  );
}
