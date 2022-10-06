import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouteMatch } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  FiAirplay,
  FiDatabase,
  FiLayers,
  FiPackage,
  FiSettings,
  FiUsers,
} from 'react-icons/fi';
import globalContainerVariants from '../utils/globalContainerVariants';
import { getEnvironmentById } from '../ipc/environmentsIpcHandler';
import EnvironmentViewParams from '../../common/interfaces/EnvironmentViewParams';
import serverImg from '../assets/img/server.png';
import '../assets/styles/views/EnvironmentView.scss';

export default function EnvironmentView(): JSX.Element {
  const { t } = useTranslation();
  const { environmentId }: EnvironmentViewParams = useParams();
  const [environmentView, setEnvironmentView] = useState(<></>);
  // const [environmentById, setEnvironmentById] = useState();
  const [defaultMessage, setDefaultMessage] = useState(<></>);
  const { path, url } = useRouteMatch();

  useEffect(() => {
    let environmentData = null;

    async function getEnvironmentData() {
      // if a environment is selected, get it's data from the database, and displays it
      environmentData = await getEnvironmentById(Number(environmentId));
      if (environmentData) {
        setEnvironmentView(
          <div className="environment-data-container">
            <div className="section">
              <h2>Menu</h2>
              <div className="side-menu">
                <div className="menu-items">
                  <Link to={`${url}/`}>
                    <FiAirplay /> Resumo
                  </Link>
                  <Link to={`${url}/database`}>
                    <FiDatabase /> Banco De Dados
                  </Link>
                  <Link to={`${url}/detailedMemory`}>
                    <FiLayers /> Memória Detalhada
                  </Link>
                  <Link to={`${url}/artifacts`}>
                    <FiPackage /> Artefatos
                  </Link>
                  <Link to={`${url}/users`}>
                    <FiUsers /> Usuários
                  </Link>
                </div>
                <div className="last-menu-item">
                  <Link to={`${url}/edit`}>
                    <FiSettings /> Configurações
                  </Link>
                </div>
              </div>
            </div>
            <div className="section">
              <h2>{environmentData.name}</h2>
            </div>
            <div className="section">
              <h2>Servidor</h2>
            </div>
          </div>
        );
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
  }, [environmentId, t, url]);

  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="centerViewContainer"
      className="center-view-container"
    >
      {environmentView === null ? defaultMessage : environmentView}
    </motion.div>
  );
}
