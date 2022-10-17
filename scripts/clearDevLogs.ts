/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import path from 'path';
import * as fs from 'fs';
import formatBytes from '../src/common/utils/formatBytes';

const appData = process.env.APPDATA;

console.log('🧹 Starting log file cleanup');
if (appData) {
  try {
    let clearedFiles = 0;
    const logPath = path.resolve(appData, 'fluig-monitor', 'logs');
    console.log(`📂 Log file location: ${logPath}`);
    let totalSize = 0;

    if (fs.existsSync(logPath)) {
      fs.readdirSync(logPath).forEach((file) => {
        const stats = fs.statSync(path.resolve(logPath, file));
        fs.rmSync(path.resolve(logPath, file));

        totalSize += stats.size;
        clearedFiles += 1;
      });

      if (clearedFiles > 0) {
        console.log(`✅ ${clearedFiles} log files have been deleted`);
        console.log(
          `🌌 A total of ${formatBytes(
            totalSize
          )} have been purged from this plane of reality`
        );
      } else {
        console.log(`✅ There are no log files to be deleted`);
      }
    }
  } catch (e: any) {
    console.log('Could not clear log files: ');
    console.log(e.stack);
  }
} else {
  console.log('❌ AppData folder could not be found');
}
