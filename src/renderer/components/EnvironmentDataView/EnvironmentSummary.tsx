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
      <section id="server-data-widgets">
        <h2>{environment.name}</h2>
        <div>
          <div>status</div>
          <div>disk</div>
          <div>memory</div>
          <div>database</div>
        </div>
        <h2>Performance</h2>
        <div>
          <div>performance graph</div>
        </div>
      </section>

      <section id="server-info-widgets">
        <div>server info</div>
        <div>licenses</div>
        <div>services</div>
      </section>
    </motion.div>
  );
}
