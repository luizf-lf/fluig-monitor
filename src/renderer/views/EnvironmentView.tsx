import { motion } from 'framer-motion';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import globalContainerVariants from '../utils/globalContainerVariants';
import { getEnvironmentById } from '../ipc/ipcHandler';
import EnvironmentViewParams from '../../common/interfaces/EnvironmentViewParams';
import serverImg from '../assets/img/server.png';
import '../assets/styles/components/CenterView.scss';

export default async function EnvironmentView(): Promise<JSX.Element> {
  const { t } = useTranslation();
  let environmentView = null;
  const { environmentId }: EnvironmentViewParams = useParams();

  // if a environment is selected, get it's data from the database, and display the data (to be implemented)
  if (typeof environmentId !== 'undefined') {
    const environmentData = await getEnvironmentById(environmentId);
    if (environmentData) {
      environmentView = <div>{environmentData.name}</div>; // it should receive a component containing all rendered data later on
    }
  }

  // shows a default message if no server is selected
  const defaultMsg = (
    <div className="empty-server-view">
      <img src={serverImg} alt="Server" className="icon" />
      <span>{t('views.EnvironmentView.empty')}</span>
    </div>
  );

  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="centerViewContainer"
    >
      {environmentView === null ? defaultMsg : environmentView}
    </motion.div>
  );
}
