/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint global-require: off, no-console: off, promise/always-return: off */

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, screen } from 'electron';

import log from 'electron-log';
import { scheduleJob } from 'node-schedule';

import MenuBuilder from './menu';
import { resolveHtmlPath } from './utils/resolveHtmlPath';
import i18n from '../common/i18n/i18n';
import {
  isDevelopment,
  logStringFormat,
  pingInterval,
  scrapeSyncInterval,
} from './utils/globalConstants';
import logSystemConfigs from './utils/logSystemConfigs';
import runDbMigrations from './database/migrationHandler';
import LanguageController from './controllers/LanguageController';

import { version } from '../../package.json';
import rotateLogFile from './utils/logRotation';
import syncEnvironmentsJob from './services/syncEnvironmentsJob';
import pingEnvironmentsJob from './services/pingEnvironmentsJob';
import addIpcHandlers from './utils/addIpcHandlers';

// log.transports.file.resolvePath = () =>
//   path.resolve(getAppDataFolder(), 'logs');
log.transports.file.format = logStringFormat;
log.transports.console.format = logStringFormat;
log.transports.file.fileName = isDevelopment ? 'app.dev.log' : 'app.log';
log.transports.file.maxSize = 0; // disable default electron-log file rotation

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (isDevelopment) {
  require('electron-debug')();
}

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

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

/**
 * Creates the main window
 */
const createWindow = async () => {
  log.info('Creating a new window');

  if (isDevelopment) {
    log.info('Installing additional dev extensions');
    await installExtensions();
  }

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

  const savedLanguage = await new LanguageController().get();

  i18n.on('languageChanged', async (lang: string) => {
    log.info(
      'i18n: Language changed, rebuilding menu and sending signal to renderer'
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
      await new LanguageController().update(lang);
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

addIpcHandlers();

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
  .then(async () => {
    const splash = new BrowserWindow({
      width: 720,
      height: 230,
      frame: false,
      alwaysOnTop: true,
      transparent: true,
      icon: getAssetPath('icon.png'),
    });

    splash.loadFile(path.resolve(__dirname, '..', 'renderer', 'splash.html'));
    splash.show();

    rotateLogFile();

    log.info(' ');
    log.info(`Fluig Monitor - v${version}`);
    log.info(
      `Starting app ${
        isDevelopment ? 'in development mode' : 'in production mode'
      }`
    );
    logSystemConfigs();

    app.name = 'Fluig Monitor';

    if (process.platform === 'win32') {
      app.setAppUserModelId(app.name);
    }

    await runDbMigrations();

    // When using node schedule with a cron like scheduler, sometimes the
    //  sync function are dispatched every second for a minute.
    // That's why the setInterval is still being used.
    // Maybe this function shall be transformed into a nodejs worker?
    log.info('Dispatching environment ping jobs');
    setInterval(async () => {
      await pingEnvironmentsJob();
    }, pingInterval);

    log.info('Dispatching environment sync jobs');
    await syncEnvironmentsJob();
    setInterval(async () => {
      await syncEnvironmentsJob();
    }, scrapeSyncInterval);

    setTimeout(async () => {
      await createWindow();
      splash.destroy();
    }, 1000);

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });

    // trigger the log file rotation every day at 00:00:05 (5 seconds past midnight)
    scheduleJob('5 0 0 * * *', () => {
      rotateLogFile();
    });
  })
  .catch((e) => {
    log.error('An unknown error occurred:');
    log.error(e);
    app.quit();
  });
