import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useParams, useRouteMatch } from 'react-router';
import { useTranslation } from 'react-i18next';
import globalContainerVariants from '../utils/globalContainerVariants';
import { getEnvironmentById } from '../ipc/environmentsIpcHandler';
import EnvironmentViewParams from '../../common/interfaces/EnvironmentViewParams';
import '../assets/styles/views/EnvironmentView.scss';
import EnvironmentDataContainer from '../components/EnvironmentDataView/EnvironmentDataContainer';

export default function EnvironmentView(): JSX.Element {
  const { t } = useTranslation();
  const { environmentId }: EnvironmentViewParams = useParams();
  const [environmentView, setEnvironmentView] = useState(<></>);

  const location = useLocation();
  const { path, url } = useRouteMatch();

  useEffect(() => {
    let environment = null;

    async function getEnvironmentData() {
      // if a environment is selected, get it's data from the database, and displays it
      environment = await getEnvironmentById(Number(environmentId));
      if (environment) {
        setEnvironmentView(
          <EnvironmentDataContainer environment={environment} />
        );
      }
    }

    getEnvironmentData();
  }, [environmentId, location, path, t, url]);

  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="centerViewContainer"
      className="center-view-container"
    >
      {environmentView}
    </motion.div>
  );
}
