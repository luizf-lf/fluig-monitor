import { motion } from 'framer-motion';
import { FiChevronRight, FiInfo, FiSettings } from 'react-icons/fi';
import { Route, Switch, useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';

import globalContainerVariants from '../utils/globalContainerVariants';

import '../assets/styles/views/AppSettings.view.scss';

interface SettingsMenuBuilder {
  title: {
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
      title: {
        name: 'Gerais',
        icon: <FiSettings />,
      },
      key: 'GENERAL_SETTINGS',
      children: [
        {
          target: `${url}/theme`,
          name: 'Tema',
        },
        {
          target: `${url}/language`,
          name: 'Idioma',
        },
      ],
    },
    {
      title: {
        name: 'Sobre',
        icon: <FiInfo />,
      },
      key: 'ABOUT',
      children: [
        {
          target: `${url}/about`,
          name: 'Sobre',
        },
        {
          target: `${url}/github`,
          name: 'GitHub',
        },
        {
          target: `${url}/reportABug`,
          name: 'Reporte um Bug',
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
                  {category.title.icon} {category.title.name}
                </h5>
                <div className="category-items">
                  {category.children.map((submenuItem) => {
                    return (
                      <Link
                        key={submenuItem.target}
                        to={submenuItem.target}
                        className="item"
                      >
                        <FiChevronRight /> {submenuItem.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </aside>
        <div className="settings-item-container">
          <Switch>
            <Route path={`${path}/theme`}>Theme Options</Route>

            <Route exact path={path}>
              <h3>Configurações</h3>
              <p>Selecione um item ao lado para acessar as configurações</p>
            </Route>
          </Switch>
        </div>
      </div>
    </motion.div>
  );
}
