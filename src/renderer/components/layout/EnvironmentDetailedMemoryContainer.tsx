import { motion } from 'framer-motion';

import globalContainerVariants from '../../utils/globalContainerVariants';

function EnvironmentDetailedMemoryContainer() {
  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="environment-detailed-memory"
    >
      <h3>Memória Detalhada</h3>
    </motion.div>
  );
}

export default EnvironmentDetailedMemoryContainer;
