import { motion } from 'framer-motion';
import globalContainerVariants from '../../utils/globalContainerVariants';
import '../assets/styles/components/CenterView.scss';
import serverImg from '../assets/img/server.png';

export default function Home(): JSX.Element {
  let ambientData = null;

  ambientData = null;

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
      {ambientData === null ? defaultMsg : ambientData}
    </motion.div>
  );
}
