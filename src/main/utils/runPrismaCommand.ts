/* eslint-disable func-names */
import path from 'path';
import log from 'electron-log';
import { fork } from 'child_process';
import { mePath, qePath } from './globalConstants';

export default async function runPrismaCommand({
  command,
  dbUrl,
}: {
  command: string[];
  dbUrl: string;
}): Promise<number> {
  log.info('Migration engine path', mePath);
  log.info('Query engine path', qePath);

  // Currently we don't have any direct method to invoke prisma migration programatically.
  // As a workaround, we spawn migration script as a child process and wait for its completion.
  // Please also refer to the following GitHub issue: https://github.com/prisma/prisma/issues/4703
  try {
    const exitCode = await new Promise((resolve /* , reject */) => {
      const prismaPath = path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        'node_modules/prisma/build/index.js'
      );
      log.info('Prisma path', prismaPath);

      const child = fork(prismaPath, command, {
        env: {
          ...process.env,
          DATABASE_URL: dbUrl,
          PRISMA_MIGRATION_ENGINE_BINARY: mePath,
          PRISMA_QUERY_ENGINE_LIBRARY: qePath,
        },
        stdio: 'pipe',
      });

      child.on('message', (msg) => {
        log.info('Message from child:', msg);
      });

      child.on('error', (err) => {
        log.error('Child process got an error:', err);
      });

      child.on('close', (code) => {
        log.info('Child process is being closed. (Exit code', code, ')');
        resolve(code);
      });

      child.stdout?.on('data', (data) => {
        log.info('prisma info: ', data.toString());
      });

      child.stderr?.on('data', (data) => {
        log.error('prisma error: ', data.toString());
      });
    });

    if (exitCode !== 0) {
      throw Error(`command ${command} failed with exit code ${exitCode}`);
    }
    return exitCode;
  } catch (e) {
    log.error(e);
    throw e;
  }
}
