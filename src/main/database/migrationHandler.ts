import { app } from 'electron';
import log from 'electron-log';
import * as fs from 'fs';
import path from 'path';
import runPrismaCommand from '../utils/runPrismaCommand';
import {
  dbPath,
  dbUrl,
  extraResourcesPath,
  isDevelopment,
  latestMigration,
  Migration,
} from '../utils/defaultConstants';
import prismaClient from './prismaContext';
import seedDb from './seedDb';

export default async function runDbMigrations() {
  let needsMigration = false;
  let mustSeed = false;
  log.info(`Checking database at ${dbPath}`);
  const dbExists = fs.existsSync(dbPath);

  if (!dbExists) {
    log.info('Database does not exists. Migration and seeding is needed.');
    needsMigration = true;
    mustSeed = true;
    // since prisma has trouble if the database file does not exist, touches an empty file
    log.info('Touching database file.');
    fs.closeSync(fs.openSync(dbPath, 'w'));
  } else {
    log.info('Database exists. Verifying the latest migration');
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
      }

      log.info('Creating a database migration notification');
      await prismaClient.notification.create({
        data: {
          type: 'info',
          title: 'Base de dados migrada',
          body: 'O banco de dados foi migrado devido à atualização de versão do aplicativo.',
        },
      });

      await prismaClient.log.create({
        data: {
          type: 'info',
          message: 'Database migration executed',
        },
      });
    } catch (e) {
      log.error('Migration executed with error.');
      log.error(e);
      process.exit(1);
    }
  } else {
    log.info('Does not need migration');
  }
}
