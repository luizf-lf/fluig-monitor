import { useEffect } from 'react';

import DatabasePanel from '../container/DatabasePanel';
import DiskPanel from '../container/DiskPanel';
import EnvironmentAvailabilityPanel from '../container/EnvironmentAvailabilityPanel';
import EnvironmentLicensesPanel from '../container/EnvironmentLicensesPanel';
import EnvironmentName from '../container/EnvironmentName';
import EnvironmentPerformanceGraph from '../container/EnvironmentPerformanceGraph';
import EnvironmentServerInfo from '../container/EnvironmentServerInfo';
import EnvironmentServicesPanel from '../container/EnvironmentServicesPanel';
import MemoryPanel from '../container/MemoryPanel';
import DefaultMotionDiv from '../base/DefaultMotionDiv';
import { GAEventsIPC } from '../../ipc/analyticsIpcHandler';

/**
 * The environment summary view container component. Acts as a container layout for the main components.
 * @since 0.1.0
 */
export default function EnvironmentDashboard() {
  useEffect(() => {
    const timer = Date.now();
    return () => {
      GAEventsIPC.pageView(
        'environment_summary',
        'Environment Dashboard',
        timer
      );
    };
  }, []);

  return (
    <DefaultMotionDiv id="environment-summary-container">
      <section id="server-data">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '2rem',
          }}
        >
          <EnvironmentName />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <EnvironmentAvailabilityPanel />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                height: 'inherit',
              }}
            >
              <DiskPanel />
              <MemoryPanel />
              <DatabasePanel />
            </div>
          </div>
        </div>
        <EnvironmentPerformanceGraph />
      </section>

      <section id="server-info">
        <EnvironmentServerInfo />
        <EnvironmentLicensesPanel />
        <EnvironmentServicesPanel />
      </section>
    </DefaultMotionDiv>
  );
}
