import { Switch, Route, useLocation } from 'react-router-dom';

import { AnimatePresence } from 'framer-motion';

import AmbientView from './views/AmbientView';
import CreateAmbientView from './views/CreateAmbientView';
import Sidebar from './components/Sidebar';

import './assets/styles/global.scss';

export default function App() {
  const location = useLocation();

  return (
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
          </Switch>
        </main>
      </div>
    </AnimatePresence>
  );
}
