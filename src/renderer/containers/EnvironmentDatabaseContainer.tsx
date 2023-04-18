import { motion } from 'framer-motion';

import globalContainerVariants from '../utils/globalContainerVariants';

import DatabaseInfoPanel from '../components/ResponsivePanels/DatabaseInfoPanel';
import DatabaseEvolutionGraph from '../components/ResponsivePanels/DatabaseEvolutionGraph';

/**
 * Environment database info container.
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
      <DatabaseEvolutionGraph />
      <DatabaseInfoPanel />
    </motion.div>
  );
}
