/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path';
import * as fs from 'fs';
import log from 'electron-log';
import compressing from 'compressing';
import { isDevelopment } from './globalConstants';
import getAppDataFolder from './fsUtils';

/**
 * Archives the app log file on a daily basis with a custom name, preventing it from being too large.
 * @since 0.1.0
 */
export default async function rotateLogFile(): Promise<void> {
  try {
    const today = new Date();
    const filePath = path.resolve(
      getAppDataFolder(),
      'logs',
      isDevelopment ? 'fluig-monitor.dev.log' : 'fluig-monitor.log'
    );
    const yesterday = new Date().setDate(today.getDate() - 1);
    const yesterdayFileFormat = new Date(yesterday)
      .toLocaleDateString('pt')
      .split('/')
      .reverse()
      .join('-');
    let logContent = null;

    // checks if the log file exists
    if (!fs.existsSync(filePath)) {
      return;
    }

    // if the current log file was last modified on a date previous to today and the rotated log file does not exits
    if (
      fs.statSync(filePath).mtime.getDate() !== today.getDate() &&
      !fs.existsSync(filePath.replace('.log', `_${yesterdayFileFormat}.log`))
    ) {
      const archiveFilePath = filePath.replace(
        '.log',
        `_${yesterdayFileFormat}.log`
      );

      logContent = fs.readFileSync(filePath, 'utf-8');

      fs.writeFileSync(archiveFilePath, logContent);

      fs.writeFileSync(filePath, '');

      await compressing.zip.compressFile(
        archiveFilePath,
        archiveFilePath.replace('.log', '.zip')
      );

      fs.rmSync(archiveFilePath);

      log.info(
        `Previous log file has been archived as ${archiveFilePath} due to file rotation`
      );
    }
  } catch (e: any) {
    log.error('Could not rotate log file: ');
    log.error(e.stack);
  }
}
