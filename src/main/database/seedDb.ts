import log from 'electron-log';
import { PrismaClient } from '../generated/client';

export default async function seedDb(prisma: PrismaClient) {
  log.info('[main] Seeding the database with default values');

  // app settings
  await prisma.appSetting.create({
    data: {
      settingId: 'FRONT_END_THEME',
      value: 'WHITE',
      group: 'SYSTEM',
    },
  });
  await prisma.appSetting.create({
    data: {
      settingId: 'APP_LANGUAGE',
      value: 'pt',
      group: 'SYSTEM',
    },
  });
  await prisma.appSetting.create({
    data: {
      settingId: 'APP_RELAY_MODE',
      value: 'MASTER', // or RELAY
      group: 'SYSTEM',
    },
  });

  // log messages
  await prisma.log.create({
    data: {
      type: 'info',
      message: 'Initial database seed executed with default values',
    },
  });
}
