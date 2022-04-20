import { useState } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';

import { AnimatePresence } from 'framer-motion';

import AmbientView from './views/AmbientView';
import CreateAmbientView from './views/CreateAmbientView';
import EditAmbientSettingsView from './views/EditAmbientSettingsView';

import './assets/styles/global.scss';
import './assets/styles/utilities.scss';
import AmbientListContext from './contexts/AmbientListContext';
import { NotificationsContextProvider } from './contexts/NotificationsContext';
import Navbar from './components/Navbar';

export default function App() {
  const location = useLocation();
  const [ambients, setAmbients] = useState([]);

  return (
    <AmbientListContext.Provider value={[ambients, setAmbients]}>
      <NotificationsContextProvider>
        <div id="appWrapper">
          <Navbar />
          <main id="mainWindow">
            <AnimatePresence exitBeforeEnter>
              <Switch location={location} key={location.pathname}>
                <Route exact path="/" component={AmbientView} />
                <Route
                  path="/settings/ambients/new"
                  component={CreateAmbientView}
                />
                <Route
                  exact
                  path="/ambient/:ambientUUID"
                  component={AmbientView}
                />
                <Route
                  path="/ambient/:ambientUUID/edit"
                  component={EditAmbientSettingsView}
                />
              </Switch>
            </AnimatePresence>
          </main>
        </div>
      </NotificationsContextProvider>
    </AmbientListContext.Provider>
  );
}
