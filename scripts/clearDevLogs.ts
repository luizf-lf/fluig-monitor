/* eslint-disable no-console */
import path from 'path';
import * as fs from 'fs';

const appData = process.env.APPDATA;

console.log('Starting log file cleanup');
if (appData) {
  const logPath = path.resolve(appData, 'fluig-monitor', 'logs', 'app.dev.log');
  console.log(`Log file location: ${logPath}`);

  if (fs.existsSync(logPath)) {
    fs.writeFile(logPath, '', () => {
      console.log('Log file cleared');
    });
  }
} else {
  console.log('AppData folder could not be found');
}
