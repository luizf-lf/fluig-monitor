import log from 'electron-log';
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
import { Environment } from '../../main/generated/client';

export interface CreateEnvironmentProps {
  environment: EnvironmentCreateControllerInterface;
  updateSchedule: UpdateScheduleFormControllerInterface;
  environmentAuthKeys: AuthKeysFormControllerInterface;
}

export async function getAllEnvironments(): Promise<Environment[]> {
  log.info('IPC Handler: Requesting all environments');
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
  log.info(
    'IPC Invoker: Requesting environment with id',
    id,
    includeRelatedData === true ? 'with related data' : 'without related data'
  );
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

  log.info('IPC Invoker: Requesting environment with id', id, 'with history.');
  const environment = ipcRenderer.invoke('getEnvironmentHistoryById', id);

  return environment;
}

export async function createEnvironment({
  environment,
  updateSchedule,
  environmentAuthKeys,
}: CreateEnvironmentProps): Promise<Environment> {
  log.info('IPC Invoker: Requesting a new environment');
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
  log.info('IPC Invoker: Requesting an environment update');

  const updatedEnvironment = await ipcRenderer.invoke(
    'updateEnvironment',
    environment,
    updateSchedule,
    authKeys
  );

  return updatedEnvironment;
}

export async function deleteEnvironment(id: number): Promise<boolean> {
  log.info('IPC Invoker: Deleting environment', id);

  const deleted = await ipcRenderer.invoke('deleteEnvironment', id);

  return deleted;
}

export async function toggleEnvironmentFavorite(
  id: number
): Promise<{ favorited: boolean; exception: string | null }> {
  const favorited = await ipcRenderer.invoke('toggleEnvironmentFavorite', id);

  return favorited;
}
