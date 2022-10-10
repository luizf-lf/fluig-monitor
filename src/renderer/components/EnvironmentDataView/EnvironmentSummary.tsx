import { motion } from 'framer-motion';
import { Environment } from '../../../main/generated/client';
import globalContainerVariants from '../../utils/globalContainerVariants';
import EnvironmentLicenses from './EnvironmentLicenses';
import EnvironmentPerformanceGraph from './EnvironmentPerformanceGraph';
import EnvironmentServerInfo from './EnvironmentServerInfo';
import EnvironmentServices from './EnvironmentServices';
import EnvironmentStatusSummary from './EnvironmentStatusSummary';

interface Props {
  environmentId: number;
}

export default function EnvironmentSummary({ environmentId }: Props) {
  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="environment-summary-container"
    >
      <section id="server-data">
        <EnvironmentStatusSummary environmentId={environmentId} />
        <EnvironmentPerformanceGraph />
      </section>

      <section id="server-info">
        <EnvironmentServerInfo />
        <EnvironmentLicenses />
        <EnvironmentServices />
      </section>
    </motion.div>
  );
}
