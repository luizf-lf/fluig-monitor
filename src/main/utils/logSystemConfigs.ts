import os from 'node:os';
import log from 'electron-log';
import formatBytes from '../../common/utils/formatBytes';

export default function logSystemConfigs() {
  const cpus = os.cpus();
  log.info('============ System Configuration ============');
  log.info(`CPU: ${cpus.length}x ${cpus[0].model}`);
  log.info(`Total RAM: ${os.totalmem()} bytes (${formatBytes(os.totalmem())})`);
  log.info(`Free RAM: ${os.freemem()} bytes (${formatBytes(os.freemem())})`);
  log.info(`System Uptime: ${os.uptime()}s`);
  log.info(`OS Type: ${os.type()}`);
  log.info(`Platform: ${os.platform()}`);
  log.info(`OS Release: ${os.release()}`);
  log.info(`Arch: ${os.arch()}`);
  log.info('==============================================');
}
