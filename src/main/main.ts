/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, screen } from 'electron';
import * as fs from 'fs';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import i18n from '../i18n/i18n';
import UserSettingsDatabaseInterface from '../interfaces/database/UserSettingsDatabaseInterface';
import EnvironmentDatabaseInterface from '../interfaces/database/EnvironmentDatabaseInterface';

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

/* Auxiliary functions */

// get the user settings file saved on the file system
function getUserSettingsFile() {
  const folderPath = path.resolve(app.getPath('appData'), 'fluig-monitor');
  const filePath = path.resolve(folderPath, 'user-settings.json');

  console.log(
    `[${new Date().toLocaleString()}] Reading user settings file from ${filePath}`
  );

  // checks if the app folder exists, and if not, creates it.
  if (!fs.existsSync(folderPath)) {
    console.log(
      `[${new Date().toLocaleString()}] Folder ${folderPath} does not exists and will be created.`
    );
    fs.mkdirSync(folderPath);
  }

  // checks if the user settings file exists, and if not, creates it with default values
  if (!fs.existsSync(filePath)) {
    const userSettingsData: UserSettingsDatabaseInterface = {
      language: 'pt',
      theme: 'LIGHT',
      openOnLastServer: false,
    };
    console.log(
      `[${new Date().toLocaleString()}] File ${filePath} does not exists and will be created.`
    );
    fs.writeFileSync(filePath, JSON.stringify(userSettingsData));

    // returns the default values
    return userSettingsData;
  }

  // if the file already exists, returns it's value;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.log(error);
    // in case of and error, return null
    return null;
  }
}

function getEnvironmentsFile() {
  const folderPath = path.resolve(app.getPath('appData'), 'fluig-monitor');
  const filePath = path.resolve(folderPath, 'environment-data.json');

  console.log(
    `[${new Date().toLocaleString()}] Reading environment data file from ${filePath}`
  );

  // checks if the app folder exists, and if not, creates it.
  if (!fs.existsSync(folderPath)) {
    console.log(
      `[${new Date().toLocaleString()}] Folder ${folderPath} does not exists and will be created.`
    );
    fs.mkdirSync(folderPath);
  }

  // checks if the environment data file exists, and if not, creates it with default values
  if (!fs.existsSync(filePath)) {
    const environmentData: EnvironmentDatabaseInterface = {
      environments: [],
      monitoringHistory: [],
    };
    console.log(
      `[${new Date().toLocaleString()}] File ${filePath} does not exists and will be created.`
    );
    fs.writeFileSync(filePath, JSON.stringify(environmentData));

    // returns the default values
    return environmentData;
  }

  // if the file already exists, returns it's value;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.log(error);
    // in case of and error, return null
    return null;
  }
}

function updateEnvironmentsFile(data: string) {
  const folderPath = path.resolve(app.getPath('appData'), 'fluig-monitor');
  const filePath = path.resolve(folderPath, 'environment-data.json');

  console.log(
    `[${new Date().toLocaleString()}] Writing environment data file to ${filePath}`
  );

  try {
    fs.writeFileSync(filePath, data);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

function updateSettingsFile(data: string) {
  const folderPath = path.resolve(app.getPath('appData'), 'fluig-monitor');
  const filePath = path.resolve(folderPath, 'user-settings.json');

  console.log(
    `[${new Date().toLocaleString()}] Writing user settings file to ${filePath}`
  );

  try {
    fs.writeFileSync(filePath, JSON.stringify(data));
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

// gets the saved language setting from the user settings file
function getSavedLanguage() {
  const userSettings = getUserSettingsFile();

  // checks if there's a valid return, and returns the saved language
  if (userSettings !== null) {
    return userSettings.language;
  }

  // returns 'portuguese' as the default language, if null is returned
  return 'pt';
}

// sets the chosen language to a local file
function setSavedLanguage(language: string) {
  const data = getUserSettingsFile();

  data.language = language;

  updateSettingsFile(data);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  // get the window size from the user's main display
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  // initial width should be 80% of the screen, unless it's bigger than 1920 pixels (ultra wide monitors)
  const initialWidth = width > 1920 ? 1920 : width * 0.8;

  mainWindow = new BrowserWindow({
    show: false,
    width: initialWidth, // initial width and height should be 80% of the screen
    height: height * 0.8,
    minWidth: 1024,
    minHeight: 728,
    icon: getAssetPath('icon.png'),
    autoHideMenuBar: false, // sets if the navbar should automatically hide
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: isDevelopment,
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));
  const menuBuilder = new MenuBuilder(mainWindow);

  const savedLanguage = getSavedLanguage();

  i18n.on('languageChanged', (lang: string) => {
    // if the buildMenu function is not called, the default electron dev menu will be rendered
    menuBuilder.buildMenu();
    mainWindow?.webContents.send('languageChanged', {
      language: lang,
      namespace: 'translation',
      resource: i18n.getResourceBundle(lang, 'translation'),
    });
    // if the locally saved language is different from the changed language, saves the set language locally

    setSavedLanguage(lang);
  });

  // change the language to the locally saved language
  i18n.changeLanguage(savedLanguage);

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });
};

// IPC listener to save local userSettings file
ipcMain.on('updateSettingsFile', (event, arg) => {
  event.returnValue = updateSettingsFile(arg);
});

// IPC listener to save local environment data file
ipcMain.on('updateEnvironmentsFile', (event, arg) => {
  event.returnValue = updateEnvironmentsFile(arg);
});

// IPC listener to get user settings file
ipcMain.on('getSettingsFile', (event) => {
  event.returnValue = getUserSettingsFile();
});

// IPC listener to get environment file
ipcMain.on('getEnvironmentsFile', (event) => {
  event.returnValue = getEnvironmentsFile();
});

// listens to a get-language event from renderer, and returns the locally saved language
ipcMain.on('getLanguage', (event) => {
  event.returnValue = getSavedLanguage();
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
