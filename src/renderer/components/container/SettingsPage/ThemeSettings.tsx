/* eslint-disable jsx-a11y/label-has-associated-control */
import { useTranslation } from 'react-i18next';
import { FiPenTool } from 'react-icons/fi';

import whiteThemePreview from '../../../assets/img/theme-preview-white.png';
import darkThemePreview from '../../../assets/img/theme-preview-dark.png';
import { useTheme } from '../../../contexts/ThemeContext';
import DefaultMotionDiv from '../../base/DefaultMotionDiv';

export default function ThemeSettings() {
  const { t } = useTranslation();
  const { theme, setFrontEndTheme } = useTheme();

  return (
    <DefaultMotionDiv id="theme-settings">
      <h3 className="icon-title">
        <span className="icon-dot purple-variant">
          <FiPenTool />
        </span>
        {t('components.ThemeSettings.title')}
      </h3>
      <p className="mb-2">{t('components.ThemeSettings.helperText')}</p>

      <div className="preview-radios">
        <div className="radio-option-container">
          <label htmlFor="radioTheme_white">
            <img
              src={whiteThemePreview}
              alt={t('components.ThemeSettings.whiteTheme')}
              className="preview-image"
            />
            <span className="radio-option">
              <input
                type="radio"
                name="radioTheme"
                id="radioTheme_white"
                value="WHITE"
                checked={theme === 'WHITE'}
                onChange={() => setFrontEndTheme('WHITE')}
              />
              {t('components.ThemeSettings.whiteTheme')}
            </span>
          </label>
        </div>
        <div className="radio-option-container">
          <label htmlFor="radioTheme_dark">
            <img
              src={darkThemePreview}
              alt={t('components.ThemeSettings.darkTheme')}
              className="preview-image"
            />
            <span className="radio-option">
              <input
                type="radio"
                name="radioTheme"
                id="radioTheme_dark"
                value="DARK"
                checked={theme === 'DARK'}
                onChange={() => setFrontEndTheme('DARK')}
              />
              {t('components.ThemeSettings.darkTheme')}
            </span>
          </label>
        </div>
      </div>
    </DefaultMotionDiv>
  );
}
