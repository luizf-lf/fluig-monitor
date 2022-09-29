import { ipcRenderer } from 'electron';
import { UpdateScheduleFormControllerInterface } from '../../common/interfaces/UpdateScheduleControllerInterface';
import { EnvironmentControllerInterface } from '../../common/interfaces/EnvironmentControllerInterface';
import { AuthKeysFormControllerInterface } from '../../common/interfaces/AuthKeysControllerInterface';
import { Environment } from '../../main/generated/client';

export interface CreateEnvironmentProps {
  environment: EnvironmentControllerInterface;
  updateSchedule: UpdateScheduleFormControllerInterface;
  environmentAuthKeys: AuthKeysFormControllerInterface;
}

export async function getAllEnvironments(): Promise<Environment[]> {
  const environments = ipcRenderer.sendSync('getAllEnvironments');

  return environments;
}

export async function getEnvironmentById(id: string): Promise<Environment> {
  if (!id) {
    throw new Error('id is required');
  }
  const environment = ipcRenderer.sendSync('getEnvironmentById', id);

  return environment;
}

// TODO: Test new invoke method @see https://www.electronjs.org/pt/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args
export async function createEnvironment({
  environment,
  updateSchedule,
  environmentAuthKeys,
}: CreateEnvironmentProps): Promise<Environment> {
  const createdEnvironment = await ipcRenderer.invoke('createEnvironment', {
    environment,
    updateSchedule,
    environmentAuthKeys,
  });

  return createdEnvironment;
}
