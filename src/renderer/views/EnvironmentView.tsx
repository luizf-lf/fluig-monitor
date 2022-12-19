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

export default function EnvironmentView(): JSX.Element {
  const { t } = useTranslation();
  const { environmentId }: EnvironmentViewParams = useParams();
  // path is used to create paths relative to the parent, while url is used to create links
  const { path, url } = useRouteMatch();
  const [menuIsClosed, setMenuIsClosed] = useState(true);

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
          <aside
            className={`side-menu ${menuIsClosed ? 'closed' : ''}`}
            onMouseOver={() => setMenuIsClosed(false)}
            onFocus={() => setMenuIsClosed(false)}
            onMouseLeave={() => setMenuIsClosed(true)}
            onBlur={() => setMenuIsClosed(true)}
          >
            <div className="menu-items">
              {submenuItems.map((item) => {
                return (
                  <Link
                    to={item.target}
                    key={item.target}
                    onClick={() => setSelectedButton(item.target)}
                    className={selectedButton === item.target ? 'active' : ''}
                    title={menuIsClosed ? item.text : undefined}
                  >
                    {item.icon}
                    <span className="item-text">{item.text}</span>
                  </Link>
                );
              })}
            </div>
            <div className="last-menu-items">
              <Link
                to={`${url}/edit`}
                onClick={() => setSelectedButton(`${url}/edit`)}
                className={selectedButton === `${url}/edit` ? 'active' : ''}
              >
                <FiSettings />{' '}
                <span className="item-text">
                  {t('views.EnvironmentDataContainer.sideMenu.settings')}
                </span>
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
              <>
                <h2>{t('views.EnvironmentDataContainer.sideMenu.database')}</h2>
                <p>{t('components.global.underDevelopment')}</p>
              </>
            </Route>
            <Route path={`${path}/detailedMemory`}>
              <>
                <h2>
                  {t('views.EnvironmentDataContainer.sideMenu.detailedMemory')}
                </h2>
                <p>{t('components.global.underDevelopment')}</p>
              </>
            </Route>
            <Route path={`${path}/artifacts`}>
              <>
                <h2>
                  {t('views.EnvironmentDataContainer.sideMenu.artifacts')}
                </h2>
                <p>{t('components.global.underDevelopment')}</p>
              </>
            </Route>
            <Route path={`${path}/users`}>
              <>
                <h2>{t('views.EnvironmentDataContainer.sideMenu.users')}</h2>
                <p>{t('components.global.underDevelopment')}</p>
              </>
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
