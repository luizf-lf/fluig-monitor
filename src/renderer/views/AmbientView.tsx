import { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router';
import globalContainerVariants from '../../utils/globalContainerVariants';
import dbHandler from '../../utils/dbHandler';
import AmbientViewParams from '../interfaces/AmbientViewParams';
import serverImg from '../assets/img/server.png';
import '../assets/styles/components/CenterView.scss';
import AmbientListContext from '../contexts/AmbientListContext';

export default function AmbientView(): JSX.Element {
  let ambientView = null;
  const { ambientUUID }: AmbientViewParams = useParams();
  const [ambientList, setAmbientList] = useContext(AmbientListContext);

  if (typeof ambientUUID !== 'undefined') {
    const ambientData = dbHandler.ambients.getByUUID(ambientUUID);
    ambientView = <div>{ambientData.name}</div>;
  }

  const defaultMsg = (
    <div className="empty-server-view">
      <img src={serverImg} alt="Server" className="icon" />
      <span>
        Selecione o ambiente ao lado ou utilize o botão <b>&quot;Novo&quot; </b>
        para criar um novo ambiente.
      </span>
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
