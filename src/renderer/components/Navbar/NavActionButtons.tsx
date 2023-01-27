import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiAirplay,
  FiBell,
  FiDownloadCloud,
  FiMoon,
  FiSettings,
  FiSun,
} from 'react-icons/fi';
import '../../assets/styles/components/Navbar/RightButtons.scss';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

interface MenuButtonObject {
  title: string;
  disabled?: boolean;
  icon: JSX.Element;
  linkTo?: string;
  onclick?: () => void;
}

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

  const buttons = [
    {
      title: t('navbar.actionButtons.updateAvailable'),
      disabled: false,
      icon: <FiDownloadCloud />,
      linkTo: null,
    },
    {
      title: `${t('navbar.actionButtons.kioskMode')} [${t(
        'components.global.underDevelopment'
      )}]`,
      disabled: true,
      icon: <FiAirplay />,
      linkTo: null,
    },
    {
      title: `${t('navbar.actionButtons.notifications')} [${t(
        'components.global.underDevelopment'
      )}]`,
      disabled: true,
      icon: <FiBell />,
      linkTo: null,
    },
    {
      title: t('navbar.actionButtons.theme'),
      disabled: false,
      icon: themeIcon,
      linkTo: null,
      onclick: toggleAppTheme,
    },
    {
      title: t('navbar.actionButtons.settings'),
      disabled: true,
      icon: <FiSettings />,
      linkTo: '/appSettings',
    },
  ] as MenuButtonObject[];

  useEffect(() => {
    setThemeIcon(theme === 'DARK' ? <FiMoon /> : <FiSun />);
  }, [theme]);

  return (
    <section id="rightButtons">
      {buttons.map(({ linkTo, title, disabled, icon, onclick }) => {
        return linkTo ? (
          <Link to={linkTo} className="optionButton" title={title}>
            {icon}
          </Link>
        ) : (
          <button
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
