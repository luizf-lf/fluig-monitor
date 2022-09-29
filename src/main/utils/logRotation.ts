import path from 'path';
import * as fs from 'fs';
import log from 'electron-log';
import { isDevelopment } from '../../common/utils/globalConstants';
import getAppDataFolder from './fsUtils';

export default function rotateLogFile(): void {
  // const dateDiffThreshold = 86400000; // 1 day
  const filePath = path.resolve(
    getAppDataFolder(),
    'logs',
    isDevelopment ? 'app.dev.log' : 'app.log'
  );

  let lastModifiedAt = null;
  let createdAt = null;

  const fileStats = fs.statSync(filePath);
  lastModifiedAt = fileStats.mtime.getTime();
  createdAt = fileStats.birthtime.getTime();

  // 1 day = 864000000;
  if (lastModifiedAt - createdAt >= 864000000) {
    log.info('This log file needs rotation and will be archived');

    fs.renameSync(filePath, filePath.replace('.log', `_${Date.now()}.log`));

    log.info('Previous log file has been archived due to file rotation');
  }
}
