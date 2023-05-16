/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { Link } from 'react-router-dom';
import {
  FiAirplay,
  FiBell,
  FiDownload,
  FiDownloadCloud,
  FiMoon,
  FiSettings,
  FiSun,
} from 'react-icons/fi';
import '../../../assets/styles/components/RightButtons.scss';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../contexts/ThemeContext';
import SpinnerLoader from '../../base/Loaders/Spinner';

export default function NavActionButtons() {
  const { t } = useTranslation();
  const { theme, setFrontEndTheme } = useTheme();
  const [themeIcon, setThemeIcon] = useState(
    theme === 'DARK' ? <FiMoon /> : <FiSun />
  );
  const [updateActionButton, setUpdateActionButton] = useState(<></>);

  function toggleAppTheme() {
    if (document.body.classList.contains('dark-theme')) {
      setFrontEndTheme('WHITE');
      setThemeIcon(<FiSun />);
    } else {
      setFrontEndTheme('DARK');
      setThemeIcon(<FiMoon />);
    }
  }

  useEffect(() => {
    setThemeIcon(theme === 'DARK' ? <FiMoon /> : <FiSun />);
  }, [theme]);

  ipcRenderer.on(
    'appUpdateStatusChange',
    (_event: Electron.IpcRendererEvent, { status }: { status: string }) => {
      if (status === 'AVAILABLE') {
        setUpdateActionButton(
          <button
            type="button"
            className="optionButton"
            title={t('navbar.actionButtons.updateAvailable')}
            onClick={() => {
              ipcRenderer.invoke('callAppUpdater', {
                forceOptions: { forceDownload: true },
              });
              setUpdateActionButton(<SpinnerLoader />);
            }}
          >
            <FiDownloadCloud />
          </button>
        );

        return;
      }

      if (status === 'DOWNLOADED') {
        setUpdateActionButton(
          <button
            type="button"
            className="optionButton"
            title={t('navbar.actionButtons.updateDownloaded')}
            onClick={() => {
              ipcRenderer.invoke('callAppUpdater', {
                forceOptions: { forceInstall: true },
              });
              setUpdateActionButton(<SpinnerLoader />);
            }}
          >
            <FiDownload />
          </button>
        );
      }
    }
  );

  return (
    <section id="rightButtons">
      {updateActionButton}
      <button
        type="button"
        className="optionButton"
        title={`${t('navbar.actionButtons.kioskMode')} [${t(
          'components.global.underDevelopment'
        )}]`}
        disabled
      >
        <FiAirplay />
      </button>
      <button
        type="button"
        className="optionButton"
        title={`${t('navbar.actionButtons.notifications')} [${t(
          'components.global.underDevelopment'
        )}]`}
        disabled
      >
        <FiBell />
      </button>
      <button
        type="button"
        className="optionButton"
        title={t('navbar.actionButtons.theme')}
        onClick={toggleAppTheme}
      >
        {themeIcon}
      </button>
      <Link
        to="/appSettings"
        className="optionButton"
        title={t('navbar.actionButtons.settings')}
      >
        <FiSettings />
      </Link>
    </section>
  );
}
