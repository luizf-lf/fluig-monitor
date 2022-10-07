import { motion } from 'framer-motion';
import { Environment } from '../../../main/generated/client';
import globalContainerVariants from '../../utils/globalContainerVariants';

interface Props {
  environment: Environment;
}

export default function EnvironmentSummary({ environment }: Props) {
  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="environment-summary-container"
    >
      <div className="section">
        <h2>{environment.name}</h2>
      </div>
      <div className="section">
        <h2>Servidor</h2>
      </div>
    </motion.div>
  );
}
