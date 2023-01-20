import log from 'electron-log';
import prismaClient from '../database/prismaContext';
import { AppSetting } from '../generated/client';

export interface AppSettingUpdatePropsInterface {
  settingId: string;
  value: string;
  group?: string | null;
}

export default class SettingsController {
  updated: null | AppSetting;

  found: null | AppSetting;

  constructor() {
    this.updated = null;
    this.found = null;
  }

  static getDefaultSetting(
    settingId: string
  ): { value: string; group: string } | null {
    switch (settingId) {
      case 'ENABLE_MINIMIZE_FEATURE':
        return {
          value: 'true',
          group: 'BEHAVIOR',
        };
      case 'ENABLE_AUTO_DOWNLOAD_UPDATE':
        return {
          value: 'true',
          group: 'GENERAL',
        };
      case 'DISABLE_MINIMIZE_NOTIFICATION':
        return {
          value: 'false',
          group: 'BEHAVIOR',
        };
      case 'ENABLE_AUTO_INSTALL_UPDATE':
        return {
          value: 'true',
          group: 'GENERAL',
        };
      default:
        return null;
    }
  }

  async find(settingId: string) {
    log.info('SettingsController: Finding system setting with id:', settingId);

    const found = await prismaClient.appSetting.findUnique({
      where: {
        settingId,
      },
    });

    if (found === null) {
      const defaultValues = SettingsController.getDefaultSetting(settingId);

      if (defaultValues) {
        log.info(
          `SettingsController: Setting not found and will be created with default values: ${JSON.stringify(
            defaultValues
          )}`
        );
        this.found = await prismaClient.appSetting.create({
          data: {
            settingId,
            value: defaultValues.value,
            group: defaultValues.group,
          },
        });
      }
    } else {
      this.found = found;
    }

    return this.found;
  }

  async update(data: AppSettingUpdatePropsInterface): Promise<AppSetting> {
    log.info(
      'SettingsController: Updating system settings with data:',
      JSON.stringify(data)
    );

    this.updated = await prismaClient.appSetting.upsert({
      where: {
        settingId: data.settingId,
      },
      create: data,
      update: data,
    });

    return this.updated;
  }
}
