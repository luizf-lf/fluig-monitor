import { useState } from 'react';
import {
  FiAirplay,
  FiDatabase,
  FiLayers,
  FiPackage,
  FiUsers,
  FiSettings,
} from 'react-icons/fi';
import { Switch, Route, useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EditEnvironmentSettingsView from '../../views/EditEnvironmentSettingsView';
import { Environment } from '../../../main/generated/client';
import EnvironmentSummary from './EnvironmentSummary';

interface Props {
  environment: Environment;
}

export default function EnvironmentDataContainer({ environment }: Props) {
  // path is used to create paths relative to the parent, while url is used to create links
  const { path, url } = useRouteMatch();
  const { t } = useTranslation();

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
            <EnvironmentSummary environment={environment} />
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
  );
}
