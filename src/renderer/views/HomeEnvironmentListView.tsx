/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiSettings, FiStar } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import SmallTag from '../components/SmallTag';

import CreateEnvironmentButton from '../components/CreateEnvironmentButton';
import { useEnvironmentList } from '../contexts/EnvironmentListContext';
import { useNotifications } from '../contexts/NotificationsContext';

import globalContainerVariants from '../utils/globalContainerVariants';
import '../assets/styles/Views/HomeAmbientListView.scss';
import graphPlaceholder from '../assets/img/graphPlaceholder.png'; // to be removed when the mini graph is implemented
import colorServer from '../assets/svg/color-server.svg';
import { Environment } from '../../main/generated/client';

export default function HomeEnvironmentListView() {
  const { environmentList } = useEnvironmentList();
  const { updateEnvironmentList } = useEnvironmentList();
  const { createShortNotification } = useNotifications();
  const { t } = useTranslation();

  useEffect(() => updateEnvironmentList(), []);

  const createAmbientHelper = (
    <div className="createAmbientCard">
      <div className="chevron">
        <FiChevronLeft />
      </div>
      <div className="info">
        <img src={colorServer} alt="Server" />
        <span>{t('views.HomeAmbientListView.createAmbientHelper')}</span>
      </div>
    </div>
  );

  function showTempMessage() {
    createShortNotification({
      id: Date.now(),
      type: 'warning',
      message: 'Favorites not available right now.',
    });
  }

  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="homeAmbientListContainer"
    >
      <h2>{t('views.HomeAmbientListView.header')}</h2>
      <div id="ambientListContent">
        <CreateEnvironmentButton isExpanded />
        {environmentList.length === 0
          ? createAmbientHelper
          : environmentList.map((environment: Environment) => {
              return (
                <div className="ambientCard" key={environment.id}>
                  <div className="heading">
                    <div className="ambientName">
                      <Link to={`/environment/${environment.id}`}>
                        <h3>{environment.name}</h3>
                        <small>{environment.baseUrl}</small>
                      </Link>
                    </div>
                    <div className="actionButtons">
                      <button type="button" onClick={showTempMessage}>
                        <FiStar />
                      </button>
                      <Link to={`/environment/${environment.id}/edit`}>
                        <FiSettings />
                      </Link>
                    </div>
                  </div>
                  <div className="graphContainer">
                    <img src={graphPlaceholder} alt="Graph Preview" />
                  </div>
                  <div className="footer">
                    <SmallTag kind={environment.kind} expanded />
                  </div>
                </div>
              );
            })}
      </div>
    </motion.div>
  );
}
