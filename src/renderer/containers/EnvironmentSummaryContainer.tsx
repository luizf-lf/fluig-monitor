import { motion } from 'framer-motion';

import globalContainerVariants from '../utils/globalContainerVariants';
import EnvironmentLicensesPanel from '../components/ResponsivePanels/EnvironmentLicensesPanel';
import EnvironmentPerformanceGraph from '../components/EnvironmentDataView/EnvironmentPerformanceGraph';
import EnvironmentServerInfo from '../components/EnvironmentDataView/EnvironmentServerInfo';
import EnvironmentServices from '../components/EnvironmentDataView/EnvironmentServices';
import EnvironmentAvailabilityPanel from '../components/ResponsivePanels/EnvironmentAvailabilityPanel';
import DatabasePanel from '../components/ResponsivePanels/SystemResources/DatabasePanel';
import DiskPanel from '../components/ResponsivePanels/SystemResources/DiskPanel';
import MemoryPanel from '../components/ResponsivePanels/SystemResources/MemoryPanel';

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
          <h2 className="title">
            {/* Environment name + version + last update */}
          </h2>
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
        {/* <EnvironmentServerInfo /> */}
        <EnvironmentLicensesPanel />
        {/* <EnvironmentServices /> */}
      </section>
    </motion.div>
  );
}
