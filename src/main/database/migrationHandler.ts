import { app } from 'electron';
import log from 'electron-log';
import * as fs from 'fs';
import path from 'path';
import runPrismaCommand from '../utils/runPrismaCommand';
import {
  dbName,
  dbPath,
  dbUrl,
  extraResourcesPath,
  isDevelopment,
  latestMigration,
  legacyDbName,
} from '../utils/globalConstants';
import prismaClient from './prismaContext';
import seedDb from './seedDb';
import { Migration } from '../interfaces/MigrationInterface';
import LogController from '../controllers/LogController';

export default async function runDbMigrations() {
  let needsMigration = false;
  let mustSeed = false;
  const fullDbPath = path.resolve(dbPath, dbName);

  log.info(`Checking database at ${fullDbPath}`);

  // checks if the legacy db exists (app.db), which was the name used until v0.2.1
  const legacyDbExists = fs.existsSync(path.resolve(dbPath, legacyDbName));
  if (legacyDbExists) {
    log.info(
      `Legacy database detected at ${path.resolve(dbPath, legacyDbName)}.`
    );
    log.info(`Database will be renamed to ${dbName}.`);

    fs.renameSync(path.resolve(dbPath, legacyDbName), fullDbPath);
  }

  const dbExists = fs.existsSync(fullDbPath);

  if (!dbExists) {
    log.info('Database does not exists. Migration and seeding is needed.');
    needsMigration = true;
    mustSeed = true;
    // since prisma has trouble if the database file does not exist, touches an empty file
    log.info('Touching database file.');
    fs.closeSync(fs.openSync(fullDbPath, 'w'));
  } else {
    log.info('Database exists. Verifying the latest migration');
    log.info(`Latest generated migration is: ${latestMigration}`);
    try {
      const latest: Migration[] =
        await prismaClient.$queryRaw`select * from _prisma_migrations order by finished_at`;
      log.info(
        `Latest migration on the database: ${
          latest[latest.length - 1]?.migration_name
        }`
      );
      needsMigration =
        latest[latest.length - 1]?.migration_name !== latestMigration;
    } catch (e) {
      log.info(
        'Latest migration could not be found, migration is needed. Error details:'
      );
      log.error(e);
      needsMigration = true;
    }
  }

  if (needsMigration) {
    try {
      const schemaPath = isDevelopment
        ? path.resolve(extraResourcesPath, 'prisma', 'schema.prisma')
        : path.resolve(app.getAppPath(), '..', 'prisma', 'schema.prisma');
      log.info(
        `Database needs a migration. Running prisma migrate with schema path ${schemaPath}`
      );

      await runPrismaCommand({
        command: ['migrate', 'deploy', '--schema', schemaPath],
        dbUrl,
      });

      log.info('Migration done.');

      if (mustSeed) {
        await seedDb(prismaClient);

        await new LogController().writeLog({
          type: 'info',
          message: 'Initial database seed executed with default values',
        });
      }

      log.info('Creating a database migration notification');
      await prismaClient.notification.create({
        data: {
          type: 'info',
          title: 'Base de dados migrada',
          body: 'O banco de dados foi migrado devido à atualização de versão do aplicativo.',
        },
      });

      await new LogController().writeLog({
        type: 'info',
        message: 'Database migration executed',
      });
    } catch (e) {
      log.error('Migration executed with error.');
      log.error(e);

      await new LogController().writeLog({
        type: 'error',
        message: `Database migration executed with error: ${e}`,
      });
      process.exit(1);
    }
  } else {
    log.info('Does not need migration');
  }
}
