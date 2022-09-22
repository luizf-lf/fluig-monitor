/* eslint-disable no-console */
import { app } from 'electron';
import path from 'path';
import * as fs from 'fs';
import log from 'electron-log';

/**
 * @function getAppDataFolder
 * @description gets the app folder path under the "appData" folder, and creates it if not exists
 * @returns {string} app folder path
 * @since 0.1.0
 */
export default function getAppDataFolder(): string {
  const folderPath = path.resolve(app.getPath('appData'), 'fluig-monitor');

  // checks if the app folder exists, and if not, creates it.
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    log.info(`Folder ${folderPath} does not exist and will be created.`);
  }

  return folderPath;
}
