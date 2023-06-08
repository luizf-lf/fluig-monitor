import { motion } from 'framer-motion';
import globalContainerVariants from '../../utils/globalContainerVariants';

function EnvironmentInsightsContainer() {
  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="environment-insights-container"
    >
      <h3>Insights</h3>
    </motion.div>
  );
}

export default EnvironmentInsightsContainer;
