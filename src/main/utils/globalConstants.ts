/**
 * This constants file should be used only on the main process, since it creates an error on the renderer
 *  where the "app" gets undefined on the renderer
 */

/* eslint-disable global-require */
import path from 'path';
import { app } from 'electron';
import getAppDataFolder from './fsUtils';

export const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('dotenv').config();
}

export const logStringFormat =
  '[{y}-{m}-{d} {h}:{i}:{s}.{ms} {z}] [{level}] [{processType}] {text}';

export const scrapeSyncInterval = 900000; // 15 minutes
export const scrapeSyncIntervalCron = '* */15 * * * *';
export const pingInterval = 15000; // 15 seconds
export const pingIntervalCron = '*/15 * * * * *';

export const legacyDbName = 'app.db';
export const dbName = 'fluig-monitor.db';
export const dbPath = isDevelopment
  ? path.resolve(__dirname, '../../../', 'prisma')
  : path.resolve(getAppDataFolder());
export const dbUrl =
  (isDevelopment
    ? process.env.DATABASE_URL
    : `file:${path.resolve(dbPath, dbName)}`) || '';

// Must be updated every time a migration is created
export const latestMigration = '20221205230300_create_resource_type_field';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const platformToExecutables: any = {
  win32: {
    migrationEngine:
      'node_modules/@prisma/engines/migration-engine-windows.exe',
    queryEngine: 'node_modules/@prisma/engines/query_engine-windows.dll.node',
  },
  linux: {
    migrationEngine:
      'node_modules/@prisma/engines/migration-engine-debian-openssl-3.0.x',
    queryEngine:
      'node_modules/@prisma/engines/libquery_engine-debian-openssl-3.0.x.so.node',
  },
  darwin: {
    migrationEngine: 'node_modules/@prisma/engines/migration-engine-darwin',
    queryEngine:
      'node_modules/@prisma/engines/libquery_engine-darwin.dylib.node',
  },
  darwinArm64: {
    migrationEngine:
      'node_modules/@prisma/engines/migration-engine-darwin-arm64',
    queryEngine:
      'node_modules/@prisma/engines/libquery_engine-darwin-arm64.dylib.node',
  },
};

export const extraResourcesPath = isDevelopment
  ? path.resolve(__dirname, '../../../')
  : app.getAppPath().replace('app.asar', '');

function getPlatformName(): string {
  const isDarwin = process.platform === 'darwin';
  if (isDarwin && process.arch === 'arm64') {
    return `${process.platform}Arm64`;
  }

  return process.platform;
}

const platformName = getPlatformName();

export const mePath = path.join(
  extraResourcesPath,
  platformToExecutables[platformName].migrationEngine
);
export const qePath = path.join(
  extraResourcesPath,
  platformToExecutables[platformName].queryEngine
);
