import { motion } from 'framer-motion';
import { useParams } from 'react-router';
import globalContainerVariants from '../../utils/globalContainerVariants';
import dbHandler from '../../utils/dbHandler';
import AmbientViewParams from '../interfaces/AmbientViewParams';
import serverImg from '../assets/img/server.png';
import '../assets/styles/components/CenterView.scss';

export default function Home(): JSX.Element {
  let ambientView = null;
  const { ambientUUID }: AmbientViewParams = useParams();
  console.log({ ambientUUID });

  const ambientData = dbHandler.ambients.getByUUID(ambientUUID);
  console.log({ ambientData });

  ambientView = <></>;

  const defaultMsg = (
    <div className="empty-server-view">
      <img src={serverImg} alt="Server" className="icon" />
      <span>
        Selecione o ambiente ao lado ou utilize o botão <b>&quot;Novo&quot; </b>
        para criar um novo ambiente.
      </span>
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
      {ambientView === null ? defaultMsg : ambientView}
    </motion.div>
  );
}
