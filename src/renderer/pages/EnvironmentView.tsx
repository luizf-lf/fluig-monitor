/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
import { Route, Routes } from 'react-router';
import { useTranslation } from 'react-i18next';
import { FiAirplay, FiDatabase, FiLayers, FiSettings } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import EnvironmentDashboard from '../components/layout/EnvironmentSummaryContainer';
import EnvironmentDatabaseContainer from '../components/layout/EnvironmentDatabaseContainer';
import EnvironmentDetailedMemoryContainer from '../components/layout/EnvironmentDetailedMemoryContainer';
import EnvironmentRuntimeStatsContainer from '../components/layout/EnvironmentRuntimeStatsContainer';
import EnvironmentArtifactsContainer from '../components/layout/EnvironmentArtifactsContainer';
import EnvironmentInsightsContainer from '../components/layout/EnvironmentInsightsContainer';
import EnvironmentServicesContainer from '../components/layout/EnvironmentServicesContainer';
import EditEnvironmentSettingsView from './EditEnvironmentSettingsView';
import DefaultMotionDiv from '../components/base/DefaultMotionDiv';

import '../assets/styles/pages/EnvironmentView.scss';

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
    // TODO: Implement remaining screens
    // {
    //   target: `runtimeStats`,
    //   text: t('views.EnvironmentDataContainer.sideMenu.runtimeStats'),
    //   icon: <FiCpu />,
    // },
    // {
    //   target: `artifacts`,
    //   text: t('views.EnvironmentDataContainer.sideMenu.artifacts'),
    //   icon: <FiGrid />,
    // },
    // {
    //   target: `insights`,
    //   text: t('views.EnvironmentDataContainer.sideMenu.insights'),
    //   icon: <FiTrendingUp />,
    // },
    // {
    //   target: `services`,
    //   text: t('views.EnvironmentDataContainer.sideMenu.services'),
    //   icon: <FiList />,
    // },
  ];

  const [selectedButton, setSelectedButton] = useState(submenuItems[0].target);

  return (
    <DefaultMotionDiv id="center-view-container">
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
            <Route path="summary" element={<EnvironmentDashboard />} />
            <Route path="database" element={<EnvironmentDatabaseContainer />} />

            <Route
              path="detailedMemory"
              element={<EnvironmentDetailedMemoryContainer />}
            />
            <Route
              path="runtimeStats"
              element={<EnvironmentRuntimeStatsContainer />}
            />
            <Route
              path="artifacts"
              element={<EnvironmentArtifactsContainer />}
            />
            <Route path="insights" element={<EnvironmentInsightsContainer />} />
            <Route path="services" element={<EnvironmentServicesContainer />} />

            <Route path="edit" element={<EditEnvironmentSettingsView />} />
          </Routes>
        </section>
      </div>
    </DefaultMotionDiv>
  );
}
