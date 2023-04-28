import { motion } from 'framer-motion';

import globalContainerVariants from '../utils/globalContainerVariants';

import DatabasePropsPanel from '../components/ResponsivePanels/DatabasePropsPanel';
import DatabaseStorageGraph from '../components/ResponsivePanels/DatabaseStorageGraph';

/**
 * Environment database info container. Has a 5 x 1 grid template.
 * @since 0.5
 */
export default function EnvironmentDatabaseContainer() {
  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="environment-database-container"
      style={{
        display: 'grid',
        gridTemplateColumns: '5fr 1fr',
        gap: '2rem',
      }}
    >
      <DatabaseStorageGraph />
      {/* // TODO: Implement database inbound and outbound traffic graphs (Statistics - dbTrafficReceived, dbTrafficSent) */}
      <DatabasePropsPanel />
    </motion.div>
  );
}
