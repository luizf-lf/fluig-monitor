import { useState } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';

import { AnimatePresence } from 'framer-motion';

import AmbientView from './views/AmbientView';
import CreateAmbientView from './views/CreateAmbientView';
import EditAmbientSettingsView from './views/EditAmbientSettingsView';
import Sidebar from './components/Sidebar';

import './assets/styles/global.scss';
import './assets/styles/utilities.scss';
import AmbientListContext from './contexts/AmbientListContext';

export default function App() {
  const location = useLocation();
  const [ambients, setAmbients] = useState([]);

  return (
    <AmbientListContext.Provider value={[ambients, setAmbients]}>
      <AnimatePresence exitBeforeEnter>
        <div id="appWrapper">
          <Sidebar />
          <main id="mainWindow">
            <Switch location={location} key={location.key}>
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
          </main>
        </div>
      </AnimatePresence>
    </AmbientListContext.Provider>
  );
}
