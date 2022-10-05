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

  async update(data: AppSettingUpdatePropsInterface): Promise<AppSetting> {
    log.info(
      'SettingsController: Updating system settings with data:',
      JSON.stringify(data)
    );

    this.updated = await prismaClient.appSetting.update({
      where: {
        settingId: data.settingId,
      },
      data,
    });

    return this.updated;
  }
}
