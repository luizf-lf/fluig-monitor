import log from 'electron-log';
import prismaClient from './prismaContext';
import GAEvents from '../analytics/GAEvents';

/**
 * Seeds the default values to the database if they don't exist.
 */
export default async function seedDefaultValues() {
  try {
    const appSettings = [
      {
        settingId: 'ENABLE_MINIMIZE_FEATURE',
        value: 'true',
        group: 'BEHAVIOR',
      },
      {
        settingId: 'DISABLE_MINIMIZE_NOTIFICATION',
        value: 'false',
        group: 'BEHAVIOR',
      },
      {
        settingId: 'ENABLE_AUTO_DOWNLOAD_UPDATE',
        value: 'true',
        group: 'GENERAL',
      },
      {
        settingId: 'ENABLE_AUTO_INSTALL_UPDATE',
        value: 'false',
        group: 'GENERAL',
      },
      {
        settingId: 'PERSISTENCE_THRESHOLD',
        value: '0',
        group: 'DATA',
      },
      {
        settingId: 'APP_LANGUAGE',
        value: 'pt',
        group: 'SYSTEM',
      },
      {
        settingId: 'FRONT_END_THEME',
        value: 'WHITE',
        group: 'SYSTEM',
      },
    ];

    appSettings.forEach(async (setting) => {
      const found = await prismaClient.appSetting.findUnique({
        where: {
          settingId: setting.settingId,
        },
      });

      if (!found) {
        log.info(
          `Default setting ${setting.settingId} was not found and will be created`
        );
        prismaClient.appSetting.create({
          data: setting,
        });

        GAEvents.seedExecuted(setting.settingId);
      }
    });
  } catch (error: unknown) {
    log.error(`Could not seed the default values: ${error}`);
  }
}
