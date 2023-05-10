import { motion } from 'framer-motion';

import globalContainerVariants from '../utils/globalContainerVariants';
import EnvironmentLicensesPanel from '../components/ResponsivePanels/EnvironmentLicensesPanel';
import EnvironmentPerformanceGraph from '../components/ResponsivePanels/EnvironmentPerformanceGraph';
import EnvironmentServerInfo from '../components/ResponsivePanels/EnvironmentServerInfo';
import EnvironmentServicesPanel from '../components/ResponsivePanels/EnvironmentServicesPanel';
import EnvironmentAvailabilityPanel from '../components/ResponsivePanels/EnvironmentAvailabilityPanel';
import DatabasePanel from '../components/ResponsivePanels/SystemResources/DatabasePanel';
import DiskPanel from '../components/ResponsivePanels/SystemResources/DiskPanel';
import MemoryPanel from '../components/ResponsivePanels/SystemResources/MemoryPanel';
import EnvironmentName from '../components/ResponsivePanels/EnvironmentName';

/**
 * The environment summary view container component. Acts as a container layout for the main components.
 * @since 0.1.0
 */
export default function EnvironmentSummary() {
  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="environment-summary-container"
    >
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
    </motion.div>
  );
}
