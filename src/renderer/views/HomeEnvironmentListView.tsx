/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiSettings } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import SmallTag from '../components/SmallTag';

import CreateEnvironmentButton from '../components/CreateEnvironmentButton';
import { useEnvironmentList } from '../contexts/EnvironmentListContext';

import globalContainerVariants from '../utils/globalContainerVariants';
import offlineImage from '../assets/img/offline.png';
import '../assets/styles/Views/HomeEnvironmentListView.scss';
import colorServer from '../assets/svg/color-server.svg';
import { Environment } from '../../main/generated/client';
import DynamicImageLoad from '../components/DynamicImageLoad';
import EnvironmentFavoriteButton from '../components/EnvironmentFavoriteButton';

export default function HomeEnvironmentListView() {
  const { environmentList } = useEnvironmentList();
  const { updateEnvironmentList } = useEnvironmentList();
  const { t } = useTranslation();

  useEffect(() => updateEnvironmentList(), []);

  const createEnvironmentHelper = (
    <div className="createEnvironmentCard">
      <div className="chevron">
        <FiChevronLeft />
      </div>
      <div className="info">
        <img src={colorServer} alt="Server" />
        <span>
          {t('views.HomeEnvironmentListView.createEnvironmentHelper')}
        </span>
      </div>
    </div>
  );

  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="homeEnvironmentListContainer"
    >
      <h2>{t('views.HomeEnvironmentListView.header')}</h2>
      <div id="EnvironmentListContent">
        <CreateEnvironmentButton isExpanded />
        {environmentList.length === 0
          ? createEnvironmentHelper
          : environmentList.map((environment: Environment) => {
              return (
                <div className="EnvironmentCard" key={environment.id}>
                  <div className="heading">
                    <div className="EnvironmentName">
                      <Link to={`/environment/${environment.id}/summary`}>
                        <h3>{environment.name}</h3>
                        <small>{environment.baseUrl}</small>
                      </Link>
                    </div>
                    <div className="actionButtons">
                      <EnvironmentFavoriteButton
                        environmentId={environment.id}
                        isFavorite={environment.isFavorite}
                      />
                      <Link to={`/environment/${environment.id}/edit`}>
                        <FiSettings />
                      </Link>
                    </div>
                  </div>
                  <div className="graphContainer">
                    <DynamicImageLoad
                      imgSrc={`${environment.baseUrl}/portal/api/servlet/image/1/custom/logo_image.png`}
                      altName={environment.name}
                      fallback={offlineImage}
                      key={environment.id}
                    />
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
