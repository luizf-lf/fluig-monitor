import { motion } from 'framer-motion';
import globalContainerVariants from '../../utils/globalContainerVariants';

function EnvironmentRuntimeStatsContainer() {
  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="runtime-stats-container"
    >
      <h3>Estatísticas De Runtime</h3>
    </motion.div>
  );
}

export default EnvironmentRuntimeStatsContainer;
