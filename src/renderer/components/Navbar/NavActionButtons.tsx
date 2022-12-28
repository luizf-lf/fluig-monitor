import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiAirplay, FiBell, FiMoon, FiSettings, FiSun } from 'react-icons/fi';
import '../../assets/styles/components/Navbar/RightButtons.scss';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

export default function NavActionButtons() {
  const { t } = useTranslation();
  const { theme, setFrontEndTheme } = useTheme();
  const [themeIcon, setThemeIcon] = useState(
    theme === 'DARK' ? <FiMoon /> : <FiSun />
  );

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
