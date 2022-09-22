import { PrismaClient } from '@prisma/client';
import log from 'electron-log';

export default async function seed(prisma: PrismaClient) {
  log.info('Seeding the database with default values');

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

  // log messages
  await prisma.log.create({
    data: {
      type: 'info',
      message: 'Initial database seed executed with default values',
    },
  });
}
