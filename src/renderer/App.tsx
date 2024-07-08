import { AnimatePresence } from 'framer-motion';
import { Route, Routes } from 'react-router-dom';

// views / components
import Navbar from './components/container/Navbar/Navbar';
import AppSettingsView from './pages/AppSettingsView';
import CreateEnvironmentView from './pages/CreateEnvironmentView';
import EnvironmentView from './pages/EnvironmentView';
import HomeEnvironmentListView from './pages/HomeEnvironmentListView';

// assets
import './assets/styles/global.scss';
import './assets/styles/utilities.scss';

// contexts
import { EnvironmentListContextProvider } from './contexts/EnvironmentListContext';
import { NotificationsContextProvider } from './contexts/NotificationsContext';
import { ThemeContextProvider } from './contexts/ThemeContext';

export default function App() {
  return (
    <EnvironmentListContextProvider>
      <NotificationsContextProvider>
        <ThemeContextProvider>
          <div id="appWrapper">
            <Navbar />
            <main id="mainWindow">
              <AnimatePresence mode="wait">
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
