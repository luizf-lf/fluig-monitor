import { motion } from 'framer-motion';
import globalContainerVariants from '../../utils/globalContainerVariants';

function EnvironmentServicesContainer() {
  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="environment-services-container"
    >
      <h3>Histórico De Serviços</h3>
    </motion.div>
  );
}

export default EnvironmentServicesContainer;
