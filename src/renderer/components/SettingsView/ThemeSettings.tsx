/* eslint-disable jsx-a11y/label-has-associated-control */
import log from 'electron-log';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPenTool } from 'react-icons/fi';
import globalContainerVariants from '../../utils/globalContainerVariants';

import whiteThemePreview from '../../assets/img/theme-preview-white.png';
import darkThemePreview from '../../assets/img/theme-preview-dark.png';
import { updateFrontEndTheme } from '../../ipc/settingsIpcHandler';

export default function ThemeSettings() {
  const [theme, setTheme] = useState(
    document.body.classList.contains('dark-theme') ? 'DARK' : 'WHITE'
  );

  // TODO: Add i18n
  // TODO: Implement a theme context to update other components on theme change

  function setAppTheme(selectedTheme: string, cacheToDb = false) {
    log.info(`Updating app front end theme to ${selectedTheme}`);

    if (selectedTheme === 'WHITE') {
      document.body.classList.remove('dark-theme');
    } else {
      document.body.classList.add('dark-theme');
    }

    setTheme(selectedTheme);

    if (cacheToDb) {
      updateFrontEndTheme(selectedTheme);
    }
  }

  function toggleAppTheme(selectedTheme: string) {
    setAppTheme(selectedTheme, true);
  }

  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h3 className="icon-title">
        <span className="icon-dot purple-variant">
          <FiPenTool />
        </span>
        Tema
      </h3>
      <p className="mb-2">
        Utilize esta opção para definir o tema a ser utilizado pela aplicação.
      </p>

      <div className="preview-radios">
        <div className="radio-option-container">
          <label htmlFor="radioTheme_white">
            <img
              src={whiteThemePreview}
              alt="white theme"
              className="preview-image"
            />
            <span className="radio-option">
              <input
                type="radio"
                name="radioTheme"
                id="radioTheme_white"
                value="WHITE"
                defaultChecked={theme === 'WHITE'}
                onClick={() => toggleAppTheme('WHITE')}
              />
              Modo Claro
            </span>
          </label>
        </div>
        <div className="radio-option-container">
          <label htmlFor="radioTheme_dark">
            <img
              src={darkThemePreview}
              alt="dark theme"
              className="preview-image"
            />
            <span className="radio-option">
              <input
                type="radio"
                name="radioTheme"
                id="radioTheme_dark"
                value="DARK"
                defaultChecked={theme === 'DARK'}
                onClick={() => toggleAppTheme('DARK')}
              />
              Modo Escuro
            </span>
          </label>
        </div>
      </div>
    </motion.div>
  );
}
