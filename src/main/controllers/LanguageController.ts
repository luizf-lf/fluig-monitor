import log from 'electron-log';
import { AppSetting } from '../generated/client';
import prismaClient from '../database/prismaContext';

export default class LanguageController {
  language: string;

  updated: AppSetting | null;

  constructor() {
    this.language = 'pt';
    this.updated = null;
  }

  async get(): Promise<string> {
    log.info('LanguageController: Querying saved language from database');
    const language = await prismaClient.appSetting.findFirst({
      where: { settingId: 'APP_LANGUAGE' },
    });

    if (language !== null) {
      this.language = language.value;
      return this.language;
    }

    return 'pt';
  }

  async update(language: string): Promise<AppSetting> {
    log.info('LanguageController: Updating app language on the database');

    this.updated = await prismaClient.appSetting.update({
      where: {
        settingId: 'APP_LANGUAGE',
      },
      data: {
        value: language,
      },
    });

    return this.updated;
  }
}
