import { copyFileSync, existsSync } from 'fs';
import path from 'path';

export default function dbBackup() {
  const basePath = path.resolve(__dirname, '..', 'prisma');
  const dbPath = path.resolve(basePath, 'fluig-monitor.db');
  if (!existsSync(dbPath)) {
    console.warn('No database found.');
    return;
  }

  const targetPath = path.resolve(basePath, `fluig-monitor_${Date.now()}.db`);
  copyFileSync(dbPath, targetPath);
  console.log('Local database backed up to', targetPath);
}

dbBackup();
