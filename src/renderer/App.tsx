import { Switch, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import log from 'electron-log';

// views / components
import EnvironmentView from './views/EnvironmentView';
import CreateEnvironmentView from './views/CreateEnvironmentView';
import EditEnvironmentSettingsView from './views/EditEnvironmentSettingsView';
import Navbar from './components/Navbar/Navbar';
import HomeAmbientListView from './views/HomeAmbientListView';

// assets
import './assets/styles/global.scss';
import './assets/styles/utilities.scss';

// contexts
import { EnvironmentListContextProvider } from './contexts/EnvironmentListContext';
import { NotificationsContextProvider } from './contexts/NotificationsContext';
import {
  isDevelopment,
  logStringFormat,
} from '../common/utils/globalConstants';

export default function App() {
  log.transports.file.fileName = isDevelopment ? 'app.dev.log' : 'app.log';
  log.transports.file.format = logStringFormat;

  // the useLocation hook is used to render a specific component per route
  const location = useLocation();

  return (
    <EnvironmentListContextProvider>
      <NotificationsContextProvider>
        <div id="appWrapper">
          <Navbar />
          <main id="mainWindow">
            <AnimatePresence exitBeforeEnter>
              <Switch location={location} key={location.pathname}>
                <Route exact path="/" component={HomeAmbientListView} />
                <Route
                  path="/settings/environments/new"
                  component={CreateEnvironmentView}
                />
                <Route
                  exact
                  path="/environment/:environmentId"
                  component={EnvironmentView}
                />
                <Route
                  path="/environment/:environmentId/edit"
                  component={EditEnvironmentSettingsView}
                />
              </Switch>
            </AnimatePresence>
          </main>
        </div>
      </NotificationsContextProvider>
    </EnvironmentListContextProvider>
  );
}
