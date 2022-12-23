import { ipcRenderer } from 'electron';
import {
  UpdateScheduleControllerInterface,
  UpdateScheduleFormControllerInterface,
} from '../../common/interfaces/UpdateScheduleControllerInterface';
import {
  EnvironmentCreateControllerInterface,
  EnvironmentUpdateControllerInterface,
  EnvironmentWithHistory,
  EnvironmentWithRelatedData,
} from '../../common/interfaces/EnvironmentControllerInterface';
import {
  AuthKeysControllerInterface,
  AuthKeysFormControllerInterface,
} from '../../common/interfaces/AuthKeysControllerInterface';
import {
  Environment,
  EnvironmentAuthKeys,
  HTTPResponse,
  UpdateSchedule,
} from '../../main/generated/client';
import {
  DBStats,
  HDStats,
  MemoryStats,
} from '../../main/controllers/StatisticsHistoryController';

export interface CreateEnvironmentProps {
  environment: EnvironmentCreateControllerInterface;
  updateSchedule: UpdateScheduleFormControllerInterface;
  environmentAuthKeys: AuthKeysFormControllerInterface;
}

interface CreatedEnvironmentProps {
  createdEnvironment: Environment;
  createdUpdateSchedule: UpdateSchedule;
  createdAuthKeys: EnvironmentAuthKeys;
}

export async function getAllEnvironments(): Promise<
  EnvironmentWithRelatedData[]
> {
  const environments = ipcRenderer.sendSync('getAllEnvironments');
  return environments;
}

export async function getEnvironmentById(
  id: number,
  includeRelatedData = false
): Promise<EnvironmentWithRelatedData> {
  if (!id) {
    throw new Error('id is required');
  }
  const environment = ipcRenderer.invoke(
    'getEnvironmentById',
    id,
    includeRelatedData
  );

  return environment;
}

export async function getEnvironmentHistoryById(
  id: number
): Promise<EnvironmentWithHistory> {
  if (!id) {
    throw new Error('Id is required');
  }
  const environment = ipcRenderer.invoke('getEnvironmentHistoryById', id);
  return environment;
}

export async function createEnvironment({
  environment,
  updateSchedule,
  environmentAuthKeys,
}: CreateEnvironmentProps): Promise<CreatedEnvironmentProps> {
  const createdEnvironment = await ipcRenderer.invoke('createEnvironment', {
    environment,
    updateSchedule,
    environmentAuthKeys,
  });

  return createdEnvironment;
}

export async function updateEnvironment(
  environment: EnvironmentUpdateControllerInterface,
  updateSchedule: UpdateScheduleControllerInterface,
  authKeys: AuthKeysControllerInterface
): Promise<Environment> {
  const updatedEnvironment = await ipcRenderer.invoke(
    'updateEnvironment',
    environment,
    updateSchedule,
    authKeys
  );

  return updatedEnvironment;
}

export async function deleteEnvironment(id: number): Promise<boolean> {
  const deleted = await ipcRenderer.invoke('deleteEnvironment', id);

  return deleted;
}

export async function toggleEnvironmentFavorite(
  id: number
): Promise<{ favorited: boolean; exception: string | null }> {
  const favorited = await ipcRenderer.invoke('toggleEnvironmentFavorite', id);

  return favorited;
}

export async function getLastHttpResponseById(
  environmentId: number
): Promise<HTTPResponse> {
  const lastResponse = await ipcRenderer.invoke(
    'getLastHttpResponseFromEnvironment',
    environmentId
  );

  return lastResponse;
}

export async function getHistoricalDiskInfo(id: number): Promise<HDStats[]> {
  const diskInfo = await ipcRenderer.invoke('getHistoricalDiskInfo', id);

  return diskInfo;
}

export async function getHistoricalMemoryInfo(
  id: number
): Promise<MemoryStats[]> {
  const memoryInfo = await ipcRenderer.invoke('getHistoricalMemoryInfo', id);

  return memoryInfo;
}

export async function getHistoricalDatabaseInfo(
  id: number
): Promise<DBStats[]> {
  const databaseInfo = await ipcRenderer.invoke(
    'getHistoricalDatabaseInfo',
    id
  );

  return databaseInfo;
}

export async function forceEnvironmentSync(): Promise<void> {
  await ipcRenderer.invoke('forceEnvironmentSync');
}

export async function forceEnvironmentPing(): Promise<void> {
  await ipcRenderer.invoke('forceEnvironmentPing');
}
