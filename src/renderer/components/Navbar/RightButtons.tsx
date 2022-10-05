import { useEffect, useState } from 'react';
import log from 'electron-log';
import { FiMoon, FiSettings, FiSun } from 'react-icons/fi';
import '../../assets/styles/components/Navbar/RightButtons.scss';
import {
  getFrontEndTheme,
  updateFrontEndTheme,
} from '../../ipc/settingsIpcHandler';

function RightButtons() {
  const [themeIcon, setThemeIcon] = useState(<FiSun />);

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
      <button type="button" className="optionButton" onClick={toggleAppTheme}>
        {themeIcon}
      </button>
      {/* TODO: Create options modal */}
      <button type="button" className="optionButton">
        <FiSettings />
      </button>
    </section>
  );
}

export default RightButtons;
