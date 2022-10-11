/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint global-require: off, no-console: off, promise/always-return: off */

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, screen, ipcMain } from 'electron';

import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './utils/resolveHtmlPath';
import i18n from '../common/i18n/i18n';
import {
  isDevelopment,
  logStringFormat,
} from '../common/utils/globalConstants';
// import getAppDataFolder from './utils/fsUtils';
import logSystemConfigs from './utils/logSystemConfigs';
import runDbMigrations from './database/migrationHandler';
import EnvironmentController from './controllers/EnvironmentController';
import LanguageController from './controllers/languageController';
import UpdateScheduleController from './controllers/UpdateScheduleController';
import { CreateEnvironmentProps } from '../renderer/ipc/environmentsIpcHandler';
import AuthKeysController from './controllers/AuthKeysController';

import { version } from '../../package.json';
import rotateLogFile from './utils/logRotation';
import { EnvironmentUpdateControllerInterface } from '../common/interfaces/EnvironmentControllerInterface';
import { UpdateScheduleControllerInterface } from '../common/interfaces/UpdateScheduleControllerInterface';
import { AuthKeysControllerInterface } from '../common/interfaces/AuthKeysControllerInterface';
import LogController from './controllers/LogController';
import SettingsController from './controllers/SettingsController';
import syncEnvironmentsJob from './jobs/syncEnvironmentsJob';

// log.transports.file.resolvePath = () =>
//   path.resolve(getAppDataFolder(), 'logs');
log.transports.file.format = logStringFormat;
log.transports.console.format = logStringFormat;
log.transports.file.fileName = isDevelopment ? 'app.dev.log' : 'app.log';
log.transports.file.maxSize = 0; // disable default electron log rotation

let mainWindow: BrowserWindow | null = null;

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

const createWindow = async () => {
  log.info('Creating a new window');

  await runDbMigrations();

  await syncEnvironmentsJob();

  // setInterval(async () => {
  //   await syncEnvironmentsJob();
  // }, 30000);

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

ipcMain.on('getAllEnvironments', async (event) => {
  log.info('IPC Listener: Recovering all environments');
  event.returnValue = await new EnvironmentController().getAll();
});

ipcMain.on('getLanguage', async (event) => {
  log.info('IPC Listener: Recovering user language');
  event.returnValue = await new LanguageController().get();
});

ipcMain.handle(
  'getEnvironmentById',
  async (
    _event: Electron.IpcMainInvokeEvent,
    id: number,
    includeRelatedData: boolean
  ) => {
    log.info('IPC Handler: Recovering environment by id');
    const environment = await new EnvironmentController().getById(
      id,
      includeRelatedData
    );

    return environment;
  }
);

ipcMain.handle(
  'createEnvironment',
  async (
    _event: Electron.IpcMainInvokeEvent,
    { environment, updateSchedule, environmentAuthKeys }: CreateEnvironmentProps
  ) => {
    log.info('IPC Handler: Saving environment');

    const createdEnvironment = await new EnvironmentController().new(
      environment
    );
    const createdUpdateSchedule = await new UpdateScheduleController().new({
      environmentId: createdEnvironment.id,
      from: updateSchedule.from,
      to: updateSchedule.to,
      onlyOnWorkDays: updateSchedule.onlyOnWorkDays,
      frequency: updateSchedule.frequency,
    });
    const createdAuthKeys = await new AuthKeysController().new({
      environmentId: createdEnvironment.id,
      payload: environmentAuthKeys.payload,
      hash: 'json',
    });

    await new LogController().writeLog({
      type: 'info',
      message: `Environment ${createdEnvironment.id} created with related data via ipcMain handler`,
    });

    return { createdEnvironment, createdUpdateSchedule, createdAuthKeys };
  }
);

ipcMain.handle(
  'updateEnvironment',
  async (
    _event: Electron.IpcMainInvokeEvent,
    environment: EnvironmentUpdateControllerInterface,
    updateSchedule: UpdateScheduleControllerInterface,
    authKeys: AuthKeysControllerInterface
  ) => {
    log.info('IPC Handler: Updating environment');

    const updatedEnvironment = await new EnvironmentController().update(
      environment
    );
    const updatedUpdateSchedule = await new UpdateScheduleController().update(
      updateSchedule
    );
    const updatedAuthKeys = await new AuthKeysController().update(authKeys);

    await new LogController().writeLog({
      type: 'info',
      message: `Environment ${updatedEnvironment.id} updated with related data via ipcMain handler`,
    });

    return { updatedEnvironment, updatedUpdateSchedule, updatedAuthKeys };
  }
);

ipcMain.handle(
  'deleteEnvironment',
  async (_event: Electron.IpcMainInvokeEvent, id: number) => {
    log.info('IPC Handler: Deleting environment');

    const deleted = await new EnvironmentController().delete(id);

    await new LogController().writeLog({
      type: 'info',
      message: `Environment ${deleted.id} deleted logically via ipcMain handler`,
    });

    return deleted;
  }
);

ipcMain.handle(
  'toggleEnvironmentFavorite',
  async (_event: Electron.IpcMainInvokeEvent, id: number) => {
    log.info(
      'IPC Handler: Toggling environment favorite for environment id',
      id
    );

    const favorited = await EnvironmentController.toggleFavorite(id);

    return favorited;
  }
);

ipcMain.handle(
  'updateFrontEndTheme',
  async (_event: Electron.IpcMainInvokeEvent, theme: string) => {
    log.info('IPC Handler: Updating front end theme');

    const updated = await new SettingsController().update({
      settingId: 'FRONT_END_THEME',
      value: theme,
    });

    return updated;
  }
);

ipcMain.handle('getFrontEndTheme', async () => {
  log.info('IPC Handler: Getting front end theme');

  const theme = await new SettingsController().find('FRONT_END_THEME');

  return theme;
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
    rotateLogFile();

    log.info(' ');
    log.info(`Fluig Monitor - v${version}`);
    log.info(
      'Starting app',
      isDevelopment ? 'in development mode' : 'in production mode'
    );
    logSystemConfigs();

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
