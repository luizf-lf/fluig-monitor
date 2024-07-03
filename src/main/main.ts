/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint global-require: off, no-console: off, promise/always-return: off */

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, screen, Tray, Notification } from 'electron';
import os from 'node:os';

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
import getAssetPath from './utils/getAssetPath';
import SettingsController from './controllers/SettingsController';
import AppUpdater from './classes/AppUpdater';
import trayBuilder from './utils/trayBuilder';
import analytics from './analytics/analytics';
import appStateHelper from './analytics/appStateHelper';

require('dotenv').config();

log.transports.file.format = logStringFormat;
log.transports.console.format = logStringFormat;
log.transports.file.fileName = isDevelopment
  ? 'fluig-monitor.dev.log'
  : 'fluig-monitor.log';
log.transports.file.maxSize = 0; // disable the default electron-log file rotation

let mainWindow: BrowserWindow | null = null;
let trayIcon: Tray | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (isDevelopment) {
  require('electron-debug')();
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

    trayIcon = trayBuilder(trayIcon, reopenWindow);

    if (mainWindow) {
      analytics
        .setParams({
          engagement_time_msec: 1000,
          category: 'Language',
          label: 'Language changed',
          value: lang,
        })
        .event('language_changed');
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

  mainWindow.on('minimize', async () => {
    const settingsController = new SettingsController();
    const appSettings = {
      disableNotify: await settingsController.find(
        'DISABLE_MINIMIZE_NOTIFICATION'
      ),
      enableMinimize: await settingsController.find('ENABLE_MINIMIZE_FEATURE'),
    };

    if (appSettings.enableMinimize?.value === 'true') {
      if (appSettings.disableNotify?.value === 'false') {
        const notification = new Notification({
          title: i18n.t('toasts.StillAlive.title'),
          body: i18n.t('toasts.StillAlive.message'),
          icon: path.join(getAssetPath(), 'icon.png'),
        });

        notification.show();
      }

      mainWindow?.hide();

      appStateHelper.setIsMinimized();

      analytics
        .setParams({
          engagement_time_msec: appStateHelper.getEngagementTime(),
          category: 'Application',
          label: 'Application minimized',
        })
        .event('app_minimized');
    }
  });
};

const reopenWindow = () => {
  if (mainWindow === null) {
    createWindow();
  } else {
    BrowserWindow.getAllWindows()[0].show();
    appStateHelper.setIsRestored();

    analytics
      .setParams({
        engagement_time_msec: appStateHelper.getEngagementTime(),
        category: 'Application',
        label: 'Application restored',
      })
      .event('app_restored');
  }
};

addIpcHandlers();

app
  .whenReady()
  .then(async () => {
    const timer = Date.now();
    const appUpdater = new AppUpdater();
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

    appUpdater.checkUpdates();

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

    // trigger the updater to check for updates every day at 00:00:10 (10s past midnight)
    scheduleJob('10 0 0 * * *', () => {
      appUpdater.checkUpdates();
    });

    appStateHelper.setIsStarted();

    const { GA_TRACKING_ID, GA_SECRET_KEY } = process.env;
    const { width, height } = screen.getPrimaryDisplay().size;

    analytics
      .config(GA_TRACKING_ID, GA_SECRET_KEY)
      .setParams({
        engagement_time_msec: appStateHelper.startedAt - timer,
        category: 'Application',
        label: 'Application started',
        app_version: version,
        app_name: app.name,
        app_mode: app.isPackaged ? 'production' : 'development',
        screen_resolution: `${width}x${height}`,
        os_platform: os.platform(),
        os_type: os.type(),
        os_release: os.release(),
        os_arch: os.arch(),
      })
      .event('app_started');
  })
  .catch((error: Error) => {
    analytics
      .setParams({
        engagement_time_msec: 100,
        category: 'Error',
        label: 'Application error',
        error_name: error.name,
        error_message: error.message,
      })
      .event('error');

    log.error('An unknown error occurred:');
    log.error(error);
    setTimeout(() => {
      app.quit();
    }, 500);
  });
