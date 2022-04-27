import { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import globalContainerVariants from '../../utils/globalContainerVariants';
import dbHandler from '../../utils/dbHandler';
import AmbientViewParams from '../interfaces/AmbientViewParams';
import serverImg from '../assets/img/server.png';
import '../assets/styles/components/CenterView.scss';
import AmbientListContext from '../contexts/AmbientListContext';

export default function AmbientView(): JSX.Element {
  const { t } = useTranslation();
  let ambientView = null;
  const { ambientUUID }: AmbientViewParams = useParams();
  const [ambientList, setAmbientList] = useContext(AmbientListContext);

  // if a ambient is selected, get it's data from the database, and display the data (to be implemented)
  if (typeof ambientUUID !== 'undefined') {
    const ambientData = dbHandler.ambients.getByUUID(ambientUUID);
    ambientView = <div>{ambientData.name}</div>; // it should receive a component containing all rendered data later on
  }

  // shows a default message if no server is selected
  const defaultMsg = (
    <div className="empty-server-view">
      <img src={serverImg} alt="Server" className="icon" />
      <span>{t('views.AmbientView.empty')}</span>
    </div>
  );

  useEffect(() => {
    setAmbientList(dbHandler.ambients.getAll());
  }, [setAmbientList]);

  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="centerViewContainer"
    >
      {ambientView === null ? defaultMsg : ambientView}
    </motion.div>
  );
}
