import { copyFileSync, readdirSync, unlinkSync } from 'fs';
import path from 'path';

function dbRestore() {
  const basePath = path.resolve(__dirname, '..', 'prisma');

  const files = readdirSync(basePath);

  const backups = files.filter(
    (file) => file.startsWith('fluig-monitor_') && file.endsWith('.db')
  );

  const oldDbPath = path.resolve(basePath, 'fluig-monitor.db');
  unlinkSync(oldDbPath);
  console.log(`Deleted database at ${oldDbPath}`);
  copyFileSync(
    path.resolve(basePath, backups[0]),
    path.resolve(basePath, 'fluig-monitor.db')
  );

  console.log(`Restored database from ${backups[0]}`);
}

dbRestore();
