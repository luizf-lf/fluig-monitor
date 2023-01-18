import log from 'electron-log';
import prismaClient from '../database/prismaContext';
import { AppSetting } from '../generated/client';

export interface AppSettingUpdatePropsInterface {
  settingId: string;
  value: string;
  group?: string | null;
}

export interface AppSettingCreateDefaultPropsInterface {
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

  async find(
    settingId: string,
    createIfNotExists = false,
    createData: AppSettingCreateDefaultPropsInterface | null = null
  ) {
    log.info('SettingsController: Finding system setting with id:', settingId);

    const found = await prismaClient.appSetting.findUnique({
      where: {
        settingId,
      },
    });

    // TODO: Move default creation values to controller
    if (found === null && createIfNotExists && createData) {
      log.info(
        `SettingsController: Setting not found and will be created with default values: ${JSON.stringify(
          createData
        )}`
      );
      this.found = await prismaClient.appSetting.create({
        data: {
          settingId,
          value: createData.value,
          group: createData.group,
        },
      });
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
