import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { EnvironmentWithHistory } from '../../../common/interfaces/EnvironmentControllerInterface';
import { getEnvironmentHistoryById } from '../../ipc/environmentsIpcHandler';
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
  const [environment, setEnvironment] = useState({} as EnvironmentWithHistory);

  useEffect(() => {
    async function getEnvironmentData() {
      const environmentDataById = await getEnvironmentHistoryById(
        Number(environmentId)
      );

      if (environmentDataById) {
        setEnvironment(environmentDataById);
        // console.log({ environmentDataById });
      }
    }

    if (typeof environmentId !== 'undefined') {
      getEnvironmentData();
    }
  }, [environmentId]);

  // setTimeout(async () => {
  //   setEnvironment(await getEnvironmentHistoryById(Number(environmentId)));
  // }, 15000);

  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="environment-summary-container"
    >
      <section id="server-data">
        <EnvironmentStatusSummary
          environmentName={environment.name}
          environmentId={environment.id}
        />
        <EnvironmentPerformanceGraph pings={environment.httpResponses} />
      </section>

      <section id="server-info">
        <EnvironmentServerInfo
          endpoint={environment.baseUrl}
          statistics={environment.statisticHistory}
        />
        <EnvironmentLicenses licenses={environment.licenseHistory} />
        <EnvironmentServices monitors={environment.monitorHistory} />
      </section>
    </motion.div>
  );
}
