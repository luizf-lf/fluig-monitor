import { motion } from 'framer-motion';
import { FiSettings } from 'react-icons/fi';
import { Route, Switch, useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';

import globalContainerVariants from '../utils/globalContainerVariants';

import '../assets/styles/views/AppSettings.view.scss';

interface SettingsMenuBuilder {
  categoryTitle: {
    name: string;
    icon: JSX.Element;
  };
  key: string;
  children: {
    target: string;
    name: string;
  }[];
}

export default function AppSettingsView() {
  const { path, url } = useRouteMatch();

  const menuBuilder = [
    {
      categoryTitle: {
        name: 'Gerais',
        icon: <FiSettings />,
      },
      key: 'GENERAL_SETTINGS',
      children: [
        {
          target: `${url}/relayMode`,
          name: 'Modo Relay',
        },
      ],
    },
  ] as SettingsMenuBuilder[];

  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="appSettingsContainer"
      className="app-settings-container"
    >
      <h2>Configurações</h2>
      <div className="settings-block-container">
        <aside className="settings-menu">
          {menuBuilder.map((category) => {
            return (
              <div className="menu-category" key={category.key}>
                <h5 className="category-title">
                  {category.categoryTitle.icon} {category.categoryTitle.name}
                </h5>
                <div className="category-items">
                  {category.children.map((submenuItem) => {
                    return (
                      <Link
                        key={submenuItem.target}
                        to={submenuItem.target}
                        className="item"
                      >
                        {submenuItem.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </aside>
        <div className="settings-item-view">
          <Switch>
            <Route path={`${path}/relayMode`}>Relay Mode</Route>

            <Route exact path={path}>
              Selecione um item ao lado
            </Route>
          </Switch>
        </div>
      </div>
    </motion.div>
  );
}
