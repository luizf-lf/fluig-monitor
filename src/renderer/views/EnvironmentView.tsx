/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Route, Switch, useParams, useRouteMatch } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  FiAirplay,
  FiDatabase,
  FiLayers,
  FiPackage,
  FiUsers,
  FiSettings,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import globalContainerVariants from '../utils/globalContainerVariants';
import EnvironmentViewParams from '../../common/interfaces/EnvironmentViewParams';
import EnvironmentSummary from '../components/EnvironmentDataView/EnvironmentSummary';
import EditEnvironmentSettingsView from './EditEnvironmentSettingsView';

import '../assets/styles/views/EnvironmentView.scss';
// import EnvironmentDataContainer from '../components/EnvironmentDataView/EnvironmentDat aContainer';

export default function EnvironmentView(): JSX.Element {
  const { t } = useTranslation();
  const { environmentId }: EnvironmentViewParams = useParams();
  // path is used to create paths relative to the parent, while url is used to create links
  const { path, url } = useRouteMatch();

  const submenuItems = [
    {
      target: `${url}/summary`,
      text: t('views.EnvironmentDataContainer.sideMenu.summary'),
      icon: <FiAirplay />,
    },
    {
      target: `${url}/database`,
      text: t('views.EnvironmentDataContainer.sideMenu.database'),
      icon: <FiDatabase />,
    },
    {
      target: `${url}/detailedMemory`,
      text: t('views.EnvironmentDataContainer.sideMenu.detailedMemory'),
      icon: <FiLayers />,
    },
    {
      target: `${url}/artifacts`,
      text: t('views.EnvironmentDataContainer.sideMenu.artifacts'),
      icon: <FiPackage />,
    },
    {
      target: `${url}/users`,
      text: t('views.EnvironmentDataContainer.sideMenu.users'),
      icon: <FiUsers />,
    },
  ];

  const [selectedButton, setSelectedButton] = useState(submenuItems[0].target);

  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="centerViewContainer"
      className="center-view-container"
    >
      <div className="environment-data-container">
        <section>
          <h2>Menu</h2>
          <aside className="side-menu">
            <div className="menu-items">
              {submenuItems.map((item) => {
                return (
                  <Link
                    to={item.target}
                    key={item.target}
                    onClick={() => setSelectedButton(item.target)}
                    className={selectedButton === item.target ? 'active' : ''}
                  >
                    {item.icon} {item.text}
                  </Link>
                );
              })}
            </div>
            <div className="last-menu-item">
              <Link
                to={`${url}/edit`}
                onClick={() => setSelectedButton(`${url}/edit`)}
                className={selectedButton === `${url}/edit` ? 'active' : ''}
              >
                <FiSettings />{' '}
                {t('views.EnvironmentDataContainer.sideMenu.settings')}
              </Link>
            </div>
          </aside>
        </section>

        <section id="menu-content">
          <Switch>
            <Route path={`${path}/summary`}>
              <EnvironmentSummary environmentId={Number(environmentId)} />
            </Route>
            <Route path={`${path}/database`}>
              <h2>Database</h2>
            </Route>
            <Route path={`${path}/detailedMemory`}>
              <h2>Detailed Memory</h2>
            </Route>
            <Route path={`${path}/artifacts`}>
              <h2>Artifacts</h2>
            </Route>
            <Route path={`${path}/users`}>
              <h2>Users</h2>
            </Route>

            <Route path={`${path}/edit`}>
              <EditEnvironmentSettingsView />
            </Route>
          </Switch>
        </section>
      </div>
    </motion.div>
  );
}
