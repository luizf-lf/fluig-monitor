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
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import i18n from '../i18n/i18n';
import {
  dbPath,
  dbUrl,
  isDevelopment,
  latestMigration,
  Migration,
} from './utils/defaultConstants';
import getAppDataFolder from './utils/fsUtils';
import prismaClient from './database/prismaContext';
import runPrismaCommand from './utils/runPrismaCommand';
import seed from './database/seed';

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

function getSavedLanguage() {
  // TODO: Get saved language from database once connection is implemented

  // returns 'portuguese' as the default language, if null is returned
  return 'pt';
}

// sets the chosen language to a local file
function setSavedLanguage(language: string) {
  console.log(language);
  // TODO: Update user language on the database
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

  /**
   * @see https://github.com/awohletz/electron-prisma-template
   */
  let needsMigration = false;
  let mustSeed = false;
  log.info(`Checking database at ${dbPath}`);
  const dbExists = fs.existsSync(dbPath);

  if (!dbExists) {
    log.info('Database does not exists. Migration and seeding is needed.');
    needsMigration = true;
    mustSeed = true;
    // since prisma has trouble if the database file does not exist, touches an empty file
    log.info('Touching database file.');
    fs.closeSync(fs.openSync(dbPath, 'w'));
  } else {
    log.info('Database exists. Verifying the latest migration');
    try {
      const latest: Migration[] =
        await prismaClient.$queryRaw`select * from _prisma_migrations order by finished_at`;
      log.info(
        `Latest migration: ${latest[latest.length - 1]?.migration_name}`
      );
      needsMigration =
        latest[latest.length - 1]?.migration_name !== latestMigration;
    } catch (e) {
      log.info('Latest migration could not be found, migration is needed');
      log.error(e);
      needsMigration = true;
    }
  }

  if (needsMigration) {
    try {
      const schemaPath = isDevelopment
        ? path.resolve(__dirname, '../', '../', 'prisma', 'schema.prisma')
        : path.join(
            app.getAppPath().replace('app.asar', 'app.asar.unpacked'),
            'prisma',
            'schema.prisma'
          );
      log.info(
        `Database needs a migration. Running prisma migrate with schema path ${schemaPath}`
      );

      await runPrismaCommand({
        command: ['migrate', 'deploy', '--schema', schemaPath],
        dbUrl,
      });
      log.info('Migration done.');

      if (mustSeed) {
        await seed(prismaClient);
      }
    } catch (e) {
      log.error(e);
      process.exit(1);
    }
  } else {
    log.info('Does not need migration');
  }

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

  const savedLanguage = getSavedLanguage();

  i18n.on('languageChanged', (lang: string) => {
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
  // event.returnValue = updateSettingsFile(arg);
  console.log(arg);
  event.returnValue = null;
});

// IPC listener to save local environment data file
ipcMain.on('updateEnvironmentsFile', (event, arg) => {
  // event.returnValue = updateEnvironmentsFile(arg);
  console.log(arg);
  event.returnValue = null;
});

// IPC listener to get user settings file
ipcMain.on('getSettingsFile', (event) => {
  // event.returnValue = getUserSettingsFile();
  event.returnValue = null;
});

// IPC listener to get environment file
ipcMain.on('getEnvironmentsFile', (event) => {
  log.info('IPC Listener -> Recovering the environments file');
  // event.returnValue = getEnvironmentsFile();
  event.returnValue = { environments: [] };
});

// listens to a get-language event from renderer, and returns the locally saved language
ipcMain.on('getLanguage', (event) => {
  log.info('IPC Listener -> Recovering the saved user language');
  event.returnValue = getSavedLanguage();
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
    log.info('App started', isDevelopment && 'in development mode');
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
