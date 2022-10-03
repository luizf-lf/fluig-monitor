/* eslint-disable no-console */
import path from 'path';
import * as fs from 'fs';

const appData = process.env.APPDATA;

console.log('🧹 Starting log file cleanup');
if (appData) {
  let clearedFiles = 0;
  const logPath = path.resolve(appData, 'fluig-monitor', 'logs');
  console.log(`📂 Log file location: ${logPath}`);

  if (fs.existsSync(logPath)) {
    fs.readdirSync(logPath).forEach((file) => {
      fs.rmSync(path.resolve(logPath, file));

      clearedFiles += 1;
    });

    if (clearedFiles > 0) {
      console.log(`✅ ${clearedFiles} log files have been deleted`);
    } else {
      console.log(`✅ There are no log files to be deleted`);
    }
  }
} else {
  console.log('❌ AppData folder could not be found');
}
