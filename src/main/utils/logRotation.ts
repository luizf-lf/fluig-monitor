import path from 'path';
import * as fs from 'fs';
import log from 'electron-log';
import { isDevelopment } from '../../common/utils/globalConstants';
import getAppDataFolder from './fsUtils';

/**
 * Archives the app log file on a daily basis with a custom name, preventing it from being too large.
 * @since 0.1.0
 */
export default function rotateLogFile(): void {
  const todayDateFormat = new Date()
    .toLocaleDateString('pt')
    .split('/')
    .reverse()
    .join('-');
  const filePath = path.resolve(
    getAppDataFolder(),
    'logs',
    isDevelopment ? 'app.dev.log' : 'app.log'
  );

  if (!fs.existsSync(filePath.replace('.log', `_${todayDateFormat}.log`))) {
    log.info('This log file needs rotation and will be archived');

    fs.renameSync(
      filePath,
      filePath.replace('.log', `_${todayDateFormat}.log`)
    );

    log.info('Previous log file has been archived due to file rotation');
  }
}
