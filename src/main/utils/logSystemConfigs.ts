import os from 'node:os';
import log from 'electron-log';
import formatBytes from './formatBytes';

export default function logSystemConfigs() {
  const cpus = os.cpus();
  log.info('============ System Configuration ============');
  for (let i = 0; i < cpus.length; i += 1) {
    log.info(`CPU${i}: ${cpus[i].model}`);
  }
  log.info(`Total RAM: ${os.totalmem()} bytes (${formatBytes(os.totalmem())})`);
  log.info(`Free RAM: ${os.freemem()} bytes (${formatBytes(os.freemem())})`);
  log.info(`System Uptime: ${os.uptime()}s`);
  log.info(`OS Release: ${os.release()}`);
  log.info(`Platform: ${os.platform()}`);
  log.info(`Arch: ${os.arch()}`);
  log.info('==============================================');
}
