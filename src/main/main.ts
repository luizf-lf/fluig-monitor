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
import i18n from '../renderer/i18n';

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

  i18n.on('languageChanged', (/* lang: i18n */) => {
    // if the buildMenu function is not called, the default dev menu will be rendered
    menuBuilder.buildMenu(); // TODO: Pass the 'lang' to the menu builder? Check if it is optimal
  });

  // change the language to Portuguese by default on i18n initialization
  // i18n.on('initialized', () => {
  i18n.changeLanguage('pt');
  // });

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

// IPC listener to save local settings file
ipcMain.on('update-db-file', (event, arg) => {
  const folderPath = path.resolve(app.getPath('appData'), 'fluig-monitor');
  const filePath = path.resolve(folderPath, 'user-settings.json');

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  console.log(
    `[${new Date().toLocaleString()}] IPC: Writing database file to ${filePath}`
  );

  try {
    fs.writeFileSync(filePath, arg);
    event.returnValue = true;
  } catch (err) {
    console.log(err);
    event.returnValue = false;
  }
});

// IPC listener to get settings file
ipcMain.on('get-db-file', (event) => {
  const filePath = path.resolve(
    app.getPath('appData'),
    'fluig-monitor',
    'user-settings.json'
  );

  console.log(
    `[${new Date().toLocaleString()}] IPC: Reading database file from ${filePath}`
  );

  try {
    event.returnValue = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    console.log(err);
    event.returnValue = null;
  }
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
