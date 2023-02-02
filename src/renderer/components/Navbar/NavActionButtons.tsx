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
import '../../assets/styles/components/Navbar/RightButtons.scss';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

interface MenuButtonObject {
  uid: string;
  title: string;
  disabled?: boolean | false;
  icon: JSX.Element;
  linkTo?: string | null;
  onclick?: () => void;
}

export default function NavActionButtons() {
  const { t } = useTranslation();
  const { theme, setFrontEndTheme } = useTheme();
  const [themeIcon, setThemeIcon] = useState(
    theme === 'DARK' ? <FiMoon /> : <FiSun />
  );
  const [navButtons, setNavButtons] = useState([] as MenuButtonObject[]);

  function toggleAppTheme() {
    if (document.body.classList.contains('dark-theme')) {
      setFrontEndTheme('WHITE');
      setThemeIcon(<FiSun />);
    } else {
      setFrontEndTheme('DARK');
      setThemeIcon(<FiMoon />);
    }
  }

  const defaultButtons = [
    {
      uid: 'KIOSK_MODE',
      title: `${t('navbar.actionButtons.kioskMode')} [${t(
        'components.global.underDevelopment'
      )}]`,
      disabled: true,
      icon: <FiAirplay />,
      linkTo: null,
    },
    {
      uid: 'NOTIFICATIONS',
      title: `${t('navbar.actionButtons.notifications')} [${t(
        'components.global.underDevelopment'
      )}]`,
      disabled: true,
      icon: <FiBell />,
      linkTo: null,
    },
    {
      uid: 'THEME_SWITCH',
      title: t('navbar.actionButtons.theme'),
      disabled: false,
      icon: themeIcon,
      linkTo: null,
      onclick: toggleAppTheme,
    },
    {
      uid: 'SETTINGS',
      title: t('navbar.actionButtons.settings'),
      disabled: true,
      icon: <FiSettings />,
      linkTo: '/appSettings',
    },
  ];

  useEffect(() => {
    setNavButtons(defaultButtons);
  }, []);

  useEffect(() => {
    setThemeIcon(theme === 'DARK' ? <FiMoon /> : <FiSun />);
  }, [theme]);

  ipcRenderer.on(
    'appUpdateStatusChange',
    (_event: Electron.IpcRendererEvent, { status }: { status: string }) => {
      // TODO: Add an click event to buttons
      if (status === 'AVAILABLE') {
        setNavButtons([
          {
            uid: 'UPDATE_AVAILABLE',
            title: t('navbar.actionButtons.updateAvailable'),
            disabled: false,
            icon: <FiDownloadCloud />,
            onclick: () => {
              // TODO: Update to a loading state
              ipcRenderer.invoke('callAppUpdater', { forceDownload: true });
            },
          },
          ...defaultButtons,
        ]);

        return;
      }

      if (status === 'DOWNLOADED') {
        setNavButtons([
          {
            uid: 'UPDATE_DOWNLOADED',
            title: t('navbar.actionButtons.updateDownloaded'),
            disabled: false,
            icon: <FiDownload />,
            onclick: () => {
              // TODO: Update to a loading state
              ipcRenderer.invoke('callAppUpdater', { forceInstall: true });
            },
          },
          ...defaultButtons,
        ]);
      }
    }
  );

  return (
    <section id="rightButtons">
      {navButtons.map(({ uid, linkTo, title, disabled, icon, onclick }) => {
        return linkTo ? (
          <Link to={linkTo} className="optionButton" title={title} key={uid}>
            {icon}
          </Link>
        ) : (
          <button
            key={uid}
            type="button"
            className="optionButton"
            title={title}
            disabled={disabled}
            onClick={onclick}
          >
            {icon}
          </button>
        );
      })}
    </section>
  );
}
