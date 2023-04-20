/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Route, Routes } from 'react-router';
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
import EnvironmentSummary from '../containers/EnvironmentSummaryContainer';
import EnvironmentDatabaseContainer from '../containers/EnvironmentDatabaseContainer';
import EditEnvironmentSettingsView from './EditEnvironmentSettingsView';

import '../assets/styles/views/EnvironmentView.scss';

export default function EnvironmentView(): JSX.Element {
  const { t } = useTranslation();
  const [menuIsClosed, setMenuIsClosed] = useState(true);

  const submenuItems = [
    {
      target: `summary`,
      text: t('views.EnvironmentDataContainer.sideMenu.summary'),
      icon: <FiAirplay />,
    },
    {
      target: `database`,
      text: t('views.EnvironmentDataContainer.sideMenu.database'),
      icon: <FiDatabase />,
    },
    {
      target: `detailedMemory`,
      text: t('views.EnvironmentDataContainer.sideMenu.detailedMemory'),
      icon: <FiLayers />,
    },
    {
      target: `artifacts`,
      text: t('views.EnvironmentDataContainer.sideMenu.artifacts'),
      icon: <FiPackage />,
    },
    {
      target: `users`,
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
                to="edit"
                onClick={() => setSelectedButton(`edit`)}
                className={selectedButton === `edit` ? 'active' : ''}
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
          <Routes>
            <Route path="summary" element={<EnvironmentSummary />} />
            <Route path="database" element={<EnvironmentDatabaseContainer />} />
            <Route
              path="detailedMemory"
              element={
                <>
                  <h2>
                    {t(
                      'views.EnvironmentDataContainer.sideMenu.detailedMemory'
                    )}
                    <p>{t('components.global.underDevelopment')}</p>
                  </h2>
                </>
              }
            />
            <Route
              path="artifacts"
              element={
                <>
                  <h2>
                    {t('views.EnvironmentDataContainer.sideMenu.artifacts')}
                    <p>{t('components.global.underDevelopment')}</p>
                  </h2>
                </>
              }
            />
            <Route
              path="users"
              element={
                <>
                  <h2>{t('views.EnvironmentDataContainer.sideMenu.users')}</h2>
                  <p>{t('components.global.underDevelopment')}</p>
                </>
              }
            />

            <Route path="edit" element={<EditEnvironmentSettingsView />} />
          </Routes>
        </section>
      </div>
    </motion.div>
  );
}
