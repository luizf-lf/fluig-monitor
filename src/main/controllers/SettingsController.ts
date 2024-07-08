/* eslint-disable no-await-in-loop */
import log from 'electron-log';
import { AppSetting } from '../generated/client';
import prismaClient from '../database/prismaContext';

export interface SettingsObject {
  [key: string]: AppSetting;
}

interface DefaultSetting {
  settingId: string;
  value: string;
  group: string;
}

export interface AppSettingUpdatePropsInterface {
  settingId: string;
  value: string;
  group?: string | null;
}

export default class SettingsController {
  /**
   * The last updated app setting
   */
  updated: null | AppSetting;

  /**
   * The last app setting found by the find() method
   */
  found: null | AppSetting;

  /**
   * All of the app settings recovered by the getAll() method
   */
  allSettings: AppSetting[];

  /**
   * All of the app settings as objects. Populated when the getAllAsObject() method is used
   */
  settingsObject: SettingsObject;

  /**
   * The default app settings. Populated on the constructor
   */
  defaultSettings: DefaultSetting[];

  /**
   * The default class constructor
   */
  constructor() {
    this.updated = null;
    this.found = null;
    this.allSettings = [];
    this.settingsObject = {};

    this.defaultSettings = [
      {
        settingId: 'ENABLE_MINIMIZE_FEATURE',
        value: 'true',
        group: 'BEHAVIOR',
      },
      {
        settingId: 'ENABLE_AUTO_DOWNLOAD_UPDATE',
        value: 'true',
        group: 'GENERAL',
      },
      {
        settingId: 'DISABLE_MINIMIZE_NOTIFICATION',
        value: 'false',
        group: 'BEHAVIOR',
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
    ];
  }

  /**
   * Recovers all the app settings.
   * @returns a promise with all of the app settings as an array
   */
  async getAll(): Promise<AppSetting[]> {
    const allSettings = await prismaClient.appSetting.findMany();
    const { defaultSettings } = this;
    const generated = [] as AppSetting[];

    for (let i = 0; i < defaultSettings.length; i += 1) {
      const defaultSetting = defaultSettings[i];

      if (
        !allSettings.find(
          (setting) => setting.settingId === defaultSetting.settingId
        )
      ) {
        generated.push(
          await prismaClient.appSetting.create({
            data: defaultSetting,
          })
        );
      }
    }

    this.allSettings = [...allSettings, ...generated];
    return this.allSettings;
  }

  /**
   * Recovers all the app settings as an object.
   * @returns a promise with all app settings as an object
   */
  async getAllAsObject(): Promise<SettingsObject> {
    const allSettings = await prismaClient.appSetting.findMany();
    const { defaultSettings } = this;

    for (let i = 0; i < defaultSettings.length; i += 1) {
      const defaultSetting = defaultSettings[i];

      if (
        !allSettings.find(
          (setting) => setting.settingId === defaultSetting.settingId
        )
      ) {
        log.info(
          `Default setting ${defaultSetting.settingId} was not found and will be created with the value ${defaultSetting.value}`
        );

        allSettings[i] = await prismaClient.appSetting.create({
          data: defaultSetting,
        });
      }
    }

    allSettings.forEach((setting) => {
      this.settingsObject[setting.settingId] = setting;
    });

    return this.settingsObject;
  }

  /**
   * Finds a specific app setting. Will try to create it with the default value.
   *  If the default value was not defined, will return null;
   * @param settingId a string with the setting key
   * @returns a promise with a single app setting or null
   */
  async find(settingId: string): Promise<AppSetting | null> {
    log.info('SettingsController: Finding system setting with id:', settingId);

    const found = await prismaClient.appSetting.findUnique({
      where: {
        settingId,
      },
    });

    if (found === null) {
      const defaultValues = this.defaultSettings.find(
        (setting) => setting.settingId === settingId
      );

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

  /**
   * Updates a single app setting
   * @param data The update data payload.
   * @returns The updated data
   */
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
