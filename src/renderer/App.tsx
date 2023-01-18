import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// views / components
import EnvironmentView from './views/EnvironmentView';
import CreateEnvironmentView from './views/CreateEnvironmentView';
import Navbar from './components/Navbar/Navbar';
import HomeEnvironmentListView from './views/HomeEnvironmentListView';
import AppSettingsView from './views/AppSettingsView';

// assets
import './assets/styles/global.scss';
import './assets/styles/utilities.scss';

// contexts
import { EnvironmentListContextProvider } from './contexts/EnvironmentListContext';
import { NotificationsContextProvider } from './contexts/NotificationsContext';
import { ThemeContextProvider } from './contexts/ThemeContext';

export default function App() {
  // the useLocation hook is used to render a specific component per route
  // const location = useLocation();

  return (
    <EnvironmentListContextProvider>
      <NotificationsContextProvider>
        <ThemeContextProvider>
          <div id="appWrapper">
            <Navbar />
            <main id="mainWindow">
              <AnimatePresence exitBeforeEnter>
                {/* <Switch location={location} key={location.pathname}> */}
                <Routes>
                  <Route path="/" element={<HomeEnvironmentListView />} />
                  <Route
                    path="/settings/environments/new"
                    element={<CreateEnvironmentView />}
                  />
                  <Route
                    path="/environment/:environmentId/*"
                    element={<EnvironmentView />}
                  />
                  <Route path="/appSettings/*" element={<AppSettingsView />} />
                </Routes>
              </AnimatePresence>
            </main>
          </div>
        </ThemeContextProvider>
      </NotificationsContextProvider>
    </EnvironmentListContextProvider>
  );
}
