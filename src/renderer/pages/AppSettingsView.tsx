import { useTranslation } from 'react-i18next';
import SystemTraySettings from '../components/container/SettingsPage/SystemTraySettings';
import LanguageSettings from '../components/container/SettingsPage/LanguageSettings';
import AboutSection from '../components/container/SettingsPage/AboutSection';
import UpdatesSettings from '../components/container/SettingsPage/UpdatesSettings';
import ThemeSettings from '../components/container/SettingsPage/ThemeSettings';

import '../assets/styles/pages/AppSettings.view.scss';
import DefaultMotionDiv from '../components/base/DefaultMotionDiv';

export default function AppSettingsView() {
  const { t } = useTranslation();

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
