/* eslint-disable global-require */
import path from 'path';
import { app } from 'electron';
import getAppDataFolder from '../../main/utils/fsUtils';

export const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('dotenv').config();
}

export const logStringFormat =
  '[{y}-{m}-{d} {h}:{i}:{s}.{ms} {z}] [{level}] [{processType}] {text}';

export const dbPath = isDevelopment
  ? path.resolve(__dirname, '../../../', 'prisma', 'app.db')
  : path.resolve(getAppDataFolder(), 'app.db');
export const dbUrl =
  (isDevelopment ? process.env.DATABASE_URL : `file:${dbPath}`) || '';

// Must be updated every time a migration is created
export const latestMigration = '20221002005308_add_favorite_env_field';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const platformToExecutables: any = {
  win32: {
    migrationEngine:
      'node_modules/@prisma/engines/migration-engine-windows.exe',
    queryEngine: 'node_modules/@prisma/engines/query_engine-windows.dll.node',
  },
  linux: {
    migrationEngine:
      'node_modules/@prisma/engines/migration-engine-debian-openssl-1.1.x',
    queryEngine:
      'node_modules/@prisma/engines/libquery_engine-debian-openssl-1.1.x.so.node',
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
