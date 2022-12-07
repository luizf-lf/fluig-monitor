import { useEffect, useState } from 'react';
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

      if (cacheToDb) {
        updateFrontEndTheme('WHITE');
      }
    } else {
      document.body.classList.add('dark-theme');
      setThemeIcon(<FiMoon />);

      if (cacheToDb) {
        updateFrontEndTheme('DARK');
      }
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
        title={t('navbar.actionButtons.kioskMode')}
        disabled
      >
        <FiAirplay />
      </button>
      <button
        type="button"
        className="optionButton"
        title={t('navbar.actionButtons.notifications')}
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
      {/* TODO: Create options modal */}
      <button
        type="button"
        className="optionButton"
        title={t('navbar.actionButtons.settings')}
        disabled
      >
        <FiSettings />
      </button>
    </section>
  );
}
