import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import globalContainerVariants from '../utils/globalContainerVariants';
import { getEnvironmentById } from '../ipc/environmentsIpcHandler';
import EnvironmentViewParams from '../../common/interfaces/EnvironmentViewParams';
import serverImg from '../assets/img/server.png';
import '../assets/styles/components/CenterView.scss';

export default function EnvironmentView(): JSX.Element {
  const { t } = useTranslation();
  const { environmentId }: EnvironmentViewParams = useParams();
  const [environmentView, setEnvironmentView] = useState(<></>);
  // const [environmentById, setEnvironmentById] = useState();
  const [defaultMessage, setDefaultMessage] = useState(<></>);

  useEffect(() => {
    let environmentData = null;

    async function getEnvironmentData() {
      // if a environment is selected, get it's data from the database, and display the data (to be implemented)
      environmentData = await getEnvironmentById(Number(environmentId));
      if (environmentData) {
        setEnvironmentView(<div>{JSON.stringify(environmentData)}</div>); // it should receive a component containing all rendered data later on
      }

      // shows a default message if no server is selected
      setDefaultMessage(
        <div className="empty-server-view">
          <img src={serverImg} alt="Server" className="icon" />
          <span>{t('views.EnvironmentView.empty')}</span>
        </div>
      );
    }

    if (typeof environmentId !== 'undefined') {
      getEnvironmentData();
    }
  }, [environmentId, t]);

  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="centerViewContainer"
    >
      {environmentView === null ? defaultMessage : environmentView}
    </motion.div>
  );
}
