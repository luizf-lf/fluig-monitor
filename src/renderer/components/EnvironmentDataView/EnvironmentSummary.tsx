/* eslint-disable react-hooks/exhaustive-deps */
import { ipcRenderer } from 'electron';
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

        // adds an event listener to auto-refresh the view when the environment is pinged
        ipcRenderer.on(`serverPinged_${environmentId}`, async () => {
          setEnvironment(
            await getEnvironmentHistoryById(Number(environmentId))
          );
        });
      }
    }

    if (typeof environmentId !== 'undefined') {
      getEnvironmentData();
    }

    // removes the channel listener on component unmount
    return () => {
      ipcRenderer.removeAllListeners(`serverPinged_${environmentId}`);
    };
  }, [environmentId]);

  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="environment-summary-container"
    >
      <section id="server-data">
        <EnvironmentStatusSummary environment={environment} />
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
