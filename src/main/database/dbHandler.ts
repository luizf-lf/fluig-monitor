import log from 'electron-log';
import { AppSetting, Environment } from '../generated/client';
import prismaClient from './prismaContext';

export interface EnvironmentControllerInterface {
  name: string;
  release: string;
  baseUrl: string;
  kind: string;
  logDeleted?: boolean;
}

export interface EnvironmentUpdateControllerInterface {
  id: number;
  name?: string;
  release?: string;
  baseUrl?: string;
  kind?: string;
  logDeleted?: boolean;
}

export async function getAllEnvironments(
  includeMonitorHistory = false
): Promise<Environment[]> {
  log.info('[main] Querying all environments from database.');
  const environments = await prismaClient.environment.findMany({
    where: {
      logDeleted: false,
    },
    include: {
      oAuthKeysId: true,
      updateScheduleId: true,
      monitorHistory: includeMonitorHistory,
    },
  });

  return environments;
}

export async function getEnvironmentById(
  id: number
): Promise<Environment | null> {
  log.info('[main] Querying environment from database with the id', id);
  const environmentData = await prismaClient.environment.findUnique({
    where: {
      id,
    },
  });

  return environmentData;
}

export async function createEnvironment(
  data: EnvironmentControllerInterface
): Promise<Environment> {
  log.info('[main] Saving a new environment on the database');
  const created = await prismaClient.environment.create({
    data,
  });

  return created;
}

export async function updateEnvironment(
  data: EnvironmentUpdateControllerInterface
): Promise<Environment> {
  log.info('[main] Updating environment with id', data.id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updatedData: any = {};

  if (data.name) updatedData.name = data.name;
  if (data.release) updatedData.release = data.release;
  if (data.baseUrl) updatedData.baseUrl = data.baseUrl;
  if (data.kind) updatedData.kind = data.kind;

  updatedData.logUpdateAt = new Date().toISOString();

  const updated = await prismaClient.environment.update({
    where: {
      id: data.id,
    },
    data: updatedData,
  });

  return updated;
}

export async function deleteEnvironment(id: number): Promise<Environment> {
  log.info('[main] Deleting environment with id', id, 'and related fields');
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
  log.info('[main] Querying system language from database');

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
  log.info('[main] Updating system language on the database');

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
