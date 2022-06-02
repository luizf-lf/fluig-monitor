import { useState } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// views / components
import EnvironmentView from './views/EnvironmentView';
import CreateEnvironmentView from './views/CreateEnvironmentView';
import EditEnvironmentSettingsView from './views/EditEnvironmentSettingsView';
import Navbar from './components/Navbar/Navbar';

// assets
import './assets/styles/global.scss';
import './assets/styles/utilities.scss';

// contexts
import EnvironmentListContext from './contexts/EnvironmentListContext';
import { NotificationsContextProvider } from './contexts/NotificationsContext';

export default function App() {
  // the useLocation hook is used to render a specific component per route
  const location = useLocation();
  const [environments, setEnvironments] = useState([]);

  return (
    <EnvironmentListContext.Provider value={[environments, setEnvironments]}>
      <NotificationsContextProvider>
        <div id="appWrapper">
          <Navbar />
          <main id="mainWindow">
            <AnimatePresence exitBeforeEnter>
              <Switch location={location} key={location.pathname}>
                <Route exact path="/" component={EnvironmentView} />
                <Route
                  path="/settings/environments/new"
                  component={CreateEnvironmentView}
                />
                <Route
                  exact
                  path="/environment/:environmentUUID"
                  component={EnvironmentView}
                />
                <Route
                  path="/environment/:environmentUUID/edit"
                  component={EditEnvironmentSettingsView}
                />
              </Switch>
            </AnimatePresence>
          </main>
        </div>
      </NotificationsContextProvider>
    </EnvironmentListContext.Provider>
  );
}
