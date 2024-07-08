import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import DefaultMotionDiv from '../components/base/DefaultMotionDiv';
import AboutSection from '../components/container/SettingsPage/AboutSection';
import LanguageSettings from '../components/container/SettingsPage/LanguageSettings';
import SystemTraySettings from '../components/container/SettingsPage/SystemTraySettings';
import ThemeSettings from '../components/container/SettingsPage/ThemeSettings';
import UpdatesSettings from '../components/container/SettingsPage/UpdatesSettings';
import { GAEventsIPC } from '../ipc/analyticsIpcHandler';

import '../assets/styles/pages/AppSettings.view.scss';

export default function AppSettingsView() {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const timer = Date.now();
    return () => {
      GAEventsIPC.pageView(
        'app_settings',
        'App Settings',
        timer,
        location.pathname,
        location.state?.from || ''
      );
    };
  }, [location]);

  return (
    <DefaultMotionDiv id="appSettingsContainer">
      <h2>{t('views.AppSettingsView.title')}</h2>
      <div className="app-settings-block-container">
        <div className="card settings-card">
          <ThemeSettings />
          <LanguageSettings />
          <UpdatesSettings />
          <SystemTraySettings />
        </div>
        <div className="card mt-2">
          <AboutSection />
        </div>
      </div>
    </DefaultMotionDiv>
  );
}
