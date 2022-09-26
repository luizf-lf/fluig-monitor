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

import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import i18n from '../i18n/i18n';
import { isDevelopment } from './utils/defaultConstants';
import getAppDataFolder from './utils/fsUtils';
import prismaClient from './database/prismaContext';
import logSystemConfigs from './utils/logSystemConfigs';
import runDbMigrations from './database/migrationHandler';
import { getAllEnvironments } from './database/dbHandler';

log.transports.file.resolvePath = () =>
  path.resolve(
    getAppDataFolder(),
    'logs',
    isDevelopment ? 'app.dev.log' : 'app.log'
  );

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (isDevelopment) {
  require('electron-debug')();
}

async function getSavedLanguage() {
  log.info('Querying system language from database');

  const language = await prismaClient.appSetting.findFirst({
    where: { settingId: 'APP_LANGUAGE' },
  });

  if (language != null) {
    return language.value;
  }

  // returns 'portuguese' as the default language, if null is returned
  return 'pt';
}

// sets the chosen language to a local file
async function setSavedLanguage(language: string) {
  log.info('Updating system language on the database');

  await prismaClient.appSetting.update({
    where: {
      settingId: 'APP_LANGUAGE',
    },
    data: {
      value: language,
    },
  });
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
  log.info('Creating a new window');

  await runDbMigrations();

  if (isDevelopment) {
    log.info('Installing additional dev extensions');
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  // get the window size from the user's main display
  const { width, height } = screen.getPrimaryDisplay().size;

  mainWindow = new BrowserWindow({
    show: false,
    width: width * 0.8, // initial width and height should be 80% of the screen
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

  const savedLanguage = await getSavedLanguage();

  i18n.on('languageChanged', async (lang: string) => {
    log.info(
      'Language changed, rebuilding menu and sending signal to renderer'
    );
    // if the buildMenu function is not called, the default electron dev menu will be rendered
    menuBuilder.buildMenu();
    mainWindow?.webContents.send('languageChanged', {
      language: lang,
      namespace: 'translation',
      resource: i18n.getResourceBundle(lang, 'translation'),
    });

    // if the locally saved language is different from the changed language, saves the set language locally
    if (savedLanguage !== lang) {
      await setSavedLanguage(lang);
    }
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

// IPC listener to get all environments
ipcMain.on('getAllEnvironments', async (event) => {
  log.info('IPC Listener -> Recovering all environments');
  event.returnValue = await getAllEnvironments();
});

// listens to a get-language event from renderer, and returns the locally saved language
ipcMain.on('getLanguage', async (event) => {
  log.info('IPC Listener -> Recovering the saved user language');
  event.returnValue = await getSavedLanguage();
});

app.on('window-all-closed', async () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
    log.info('Main windows closed. Exiting the app.');
  }
});

app
  .whenReady()
  .then(() => {
    logSystemConfigs();

    log.info(
      'App started',
      isDevelopment ? 'in development mode' : 'in production mode'
    );
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch((e) => {
    log.error('An unknown error occurred:');
    log.error(e);
    app.quit();
  });
