import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import log from 'electron-log';
import { FiAirplay, FiBell, FiMoon, FiSettings, FiSun } from 'react-icons/fi';
import '../../assets/styles/components/Navbar/RightButtons.scss';
import { useTranslation } from 'react-i18next';
import {
  getFrontEndTheme,
  updateFrontEndTheme,
} from '../../ipc/settingsIpcHandler';

export default function NavActionButtons() {
  const [themeIcon, setThemeIcon] = useState(<FiSun />);
  const { t } = useTranslation();

  function setTheme(theme: string, cacheToDb = false) {
    log.info('Updating app front end theme to', theme);

    if (theme === 'WHITE') {
      document.body.classList.remove('dark-theme');
      setThemeIcon(<FiSun />);
    } else {
      document.body.classList.add('dark-theme');
      setThemeIcon(<FiMoon />);
    }

    if (cacheToDb) {
      updateFrontEndTheme(theme);
    }
  }

  function toggleAppTheme() {
    if (document.body.classList.contains('dark-theme')) {
      setTheme('WHITE', true);
    } else {
      setTheme('DARK', true);
    }
  }

  useEffect(() => {
    async function fetch() {
      const theme = await getFrontEndTheme();

      setTheme(theme);
    }

    fetch();
  }, []);

  return (
    <section id="rightButtons">
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
        onClick={toggleAppTheme}
        title={t('navbar.actionButtons.theme')}
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
