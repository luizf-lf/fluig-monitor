import log from 'electron-log';
import { AppSetting, Environment } from '../generated/client';
import prismaClient from './prismaContext';

export async function getAllEnvironments(): Promise<Environment[] | null> {
  log.info('Querying all environments from database.');
  const environments = await prismaClient.environment.findMany({
    where: {
      logDeleted: false,
    },
  });

  return environments;
}

export async function getEnvironmentById(
  id: number
): Promise<Environment | null> {
  log.info('Querying environment from database with the id', id);
  const environmentData = await prismaClient.environment.findUnique({
    where: {
      id,
    },
  });

  return environmentData;
}

export async function createEnvironment(
  data: Environment
): Promise<Environment> {
  log.info('Saving a new environment on the database');
  const created = await prismaClient.environment.create({
    data,
  });

  return created;
}

export async function updateEnvironment(
  data: Environment
): Promise<Environment> {
  log.info('Updating environment with uuid ', data.id);
  const updated = await prismaClient.environment.update({
    where: {
      id: data.id,
    },
    data,
  });

  return updated;
}

export async function deleteEnvironment(id: number): Promise<Environment> {
  const deleted = await prismaClient.environment.update({
    where: {
      id,
    },
    data: {
      logDeleted: true,
    },
  });

  return deleted;
}

export async function getSavedLanguage(): Promise<string> {
  log.info('Querying system language from database');

  const language = await prismaClient.appSetting.findFirst({
    where: { settingId: 'APP_LANGUAGE' },
  });

  if (language != null) {
    return language.value;
  }

  // returns 'portuguese' as the default language, if null is returned
  return 'pt';
}

// sets the chosen language to a local file
export async function setSavedLanguage(language: string): Promise<AppSetting> {
  log.info('Updating system language on the database');

  const updated = await prismaClient.appSetting.update({
    where: {
      settingId: 'APP_LANGUAGE',
    },
    data: {
      value: language,
    },
  });

  return updated;
}
