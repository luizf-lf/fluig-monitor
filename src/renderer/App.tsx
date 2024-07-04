import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// views / components
import EnvironmentView from './pages/EnvironmentView';
import CreateEnvironmentView from './pages/CreateEnvironmentView';
import Navbar from './components/container/Navbar/Navbar';
import HomeEnvironmentListView from './pages/HomeEnvironmentListView';
import AppSettingsView from './pages/AppSettingsView';

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
              <AnimatePresence mode="wait">
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
