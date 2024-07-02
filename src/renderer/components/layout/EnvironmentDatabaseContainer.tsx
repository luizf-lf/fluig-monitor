import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import DatabasePropsPanel from '../container/DatabasePropsPanel';
import DatabaseStorageGraph from '../container/DatabaseStorageGraph';
import DatabaseNetworkGraph from '../container/DatabaseNetworkGraph';
import DefaultMotionDiv from '../base/DefaultMotionDiv';
import { reportPageView } from '../../ipc/analyticsIpcHandler';

/**
 * Environment database info container. Has a 5 x 1 grid template.
 * @since 0.5
 */
export default function EnvironmentDatabaseContainer() {
  const location = useLocation();

  useEffect(() => {
    reportPageView(
      'environment_database',
      'Environment Database',
      location.hash
    );
  }, [location.hash]);
  return (
    <DefaultMotionDiv id="environment-database-container">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '5fr 1fr',
          gap: '2rem',
        }}
      >
        <div>
          <DatabaseStorageGraph />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
            }}
          >
            <DatabaseNetworkGraph mode="INBOUND" />
            <DatabaseNetworkGraph mode="OUTBOUND" />
          </div>
          <DatabaseNetworkGraph mode="MIXED" />
        </div>
        <DatabasePropsPanel />
      </div>
    </DefaultMotionDiv>
  );
}
