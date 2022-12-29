import log from 'electron-log';
import prismaClient from '../database/prismaContext';
import { AppSetting } from '../generated/client';

interface AppSettingUpdatePropsInterface {
  settingId: string;
  value: string;
  group?: string;
}

export default class SettingsController {
  updated: null | AppSetting;

  found: null | AppSetting;

  constructor() {
    this.updated = null;
    this.found = null;
  }

  async find(settingId: string) {
    log.info('SettingsController: Finding system setting with id:', settingId);

    this.found = await prismaClient.appSetting.findUnique({
      where: {
        settingId,
      },
    });

    return this.found;
  }

  // TODO: Maybe implement a method to find and create if it not exists?

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
