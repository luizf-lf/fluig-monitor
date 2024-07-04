/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

import CreateEnvironmentButton from '../components/base/CreateEnvironmentButton';
import { useEnvironmentList } from '../contexts/EnvironmentListContext';

import colorServer from '../assets/svg/color-server.svg';
import HomeEnvironmentCard from '../components/container/HomeEnvironmentCard';

import '../assets/styles/pages/HomeEnvironmentListView.scss';
import DefaultMotionDiv from '../components/base/DefaultMotionDiv';
import { GAEventsIPC } from '../ipc/analyticsIpcHandler';

export default function HomeEnvironmentListView() {
  const { environmentList, updateEnvironmentList } = useEnvironmentList();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = Date.now();
    async function fetchData() {
      updateEnvironmentList();
    }

    fetchData();

    return () => {
      GAEventsIPC.pageView('home', 'Home', timer);
    };
  }, []);

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
    <DefaultMotionDiv id="homeEnvironmentListContainer">
      <h2>{t('views.HomeEnvironmentListView.header')}</h2>
      <div id="EnvironmentListContent">
        <CreateEnvironmentButton isExpanded />
        {environmentList.length === 0
          ? createEnvironmentHelper
          : environmentList.map((environment) => (
              <HomeEnvironmentCard
                injectedEnvironment={environment}
                key={environment.id}
              />
            ))}
      </div>
    </DefaultMotionDiv>
  );
}
