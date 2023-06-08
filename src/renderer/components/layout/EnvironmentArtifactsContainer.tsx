import { motion } from 'framer-motion';
import globalContainerVariants from '../../utils/globalContainerVariants';

function EnvironmentArtifactsContainer() {
  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="environment-artifacts-container"
    >
      <h3>Artefatos</h3>
    </motion.div>
  );
}

export default EnvironmentArtifactsContainer;
