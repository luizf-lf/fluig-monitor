import { motion } from 'framer-motion';
import { FiChevronRight, FiInfo, FiSettings } from 'react-icons/fi';
import { Route, Switch, useRouteMatch } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import globalContainerVariants from '../utils/globalContainerVariants';

import ThemeSettings from '../components/SettingsView/ThemeSettings';
import LanguageSettings from '../components/SettingsView/LanguageSettings';
import AboutSection from '../components/SettingsView/AboutSection';
import GitHubSection from '../components/SettingsView/GitHubSection';
import ReportABugSection from '../components/SettingsView/ReportABugSection';

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
    component: JSX.Element;
  }[];
}

export default function AppSettingsView() {
  const { path, url } = useRouteMatch();
  const { t } = useTranslation();

  const menuBuilder = [
    {
      title: {
        name: t('views.AppSettingsView.settingsMenu.categories.general'),
        icon: <FiSettings />,
      },
      key: 'GENERAL_SETTINGS',
      children: [
        {
          target: `${url}/theme`,
          name: t('views.AppSettingsView.settingsMenu.pages.theme'),
          component: <ThemeSettings />,
        },
        {
          target: `${url}/language`,
          name: t('views.AppSettingsView.settingsMenu.pages.language'),
          component: <LanguageSettings />,
        },
      ],
    },
    {
      title: {
        name: t('views.AppSettingsView.settingsMenu.categories.about'),
        icon: <FiInfo />,
      },
      key: 'ABOUT',
      children: [
        {
          target: `${url}/about`,
          name: t('views.AppSettingsView.settingsMenu.pages.about'),
          component: <AboutSection />,
        },
        {
          target: `${url}/github`,
          name: t('views.AppSettingsView.settingsMenu.pages.github'),
          component: <GitHubSection />,
        },
        {
          target: `${url}/reportABug`,
          name: t('views.AppSettingsView.settingsMenu.pages.reportABug'),
          component: <ReportABugSection />,
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
      <h2>{t('views.AppSettingsView.title')}</h2>
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
            {menuBuilder.map((cat /** 😺 */) => {
              return cat.children.map((item) => {
                return (
                  <Route path={item.target} key={item.target}>
                    {item.component}
                  </Route>
                );
              });
            })}

            <Route exact path={path}>
              <h3>{t('views.AppSettingsView.emptyRoute.title')}</h3>
              <p>{t('views.AppSettingsView.emptyRoute.helper')}</p>
            </Route>
          </Switch>
        </div>
      </div>
    </motion.div>
  );
}
