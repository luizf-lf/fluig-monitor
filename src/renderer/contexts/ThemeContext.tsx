import log from 'electron-log';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getAppSetting, updateAppSettings } from '../ipc/settingsIpcHandler';

interface ThemeContextProviderProps {
  children: ReactNode;
}

// Defines the theme context interface (current theme and the switch function)
interface ThemeContextData {
  theme: string;
  setFrontEndTheme: (theme: string) => void;
}

// exports the theme context
export const ThemeContext = createContext({} as ThemeContextData);

// exports the theme context provider, with the current theme value and switch function
export function ThemeContextProvider({ children }: ThemeContextProviderProps) {
  const [theme, setTheme] = useState(
    document.body.classList.contains('dark-theme') ? 'DARK' : 'WHITE'
  );

  // function that sets the theme to the body and the local database
  function setFrontEndTheme(selectedTheme: string, updateDbValue = true) {
    log.info(`Updating app front end theme to ${selectedTheme} via context.`);

    if (selectedTheme === 'WHITE') {
      document.body.classList.remove('dark-theme');
    } else {
      document.body.classList.add('dark-theme');
    }

    setTheme(selectedTheme);

    if (updateDbValue) {
      updateAppSettings([
        {
          settingId: 'FRONT_END_THEME',
          value: selectedTheme,
        },
      ]);
    }
  }

  // loads the theme saved on the database
  useEffect(() => {
    async function loadThemeFromDb() {
      const savedTheme = await getAppSetting('FRONT_END_THEME');

      if (savedTheme) {
        setFrontEndTheme(savedTheme.value, false);
      }
    }

    loadThemeFromDb();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setFrontEndTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// exports the useTheme method for easy import
export const useTheme = () => {
  return useContext(ThemeContext);
};
