import { ipcRenderer } from 'electron';
import { EnvironmentControllerInterface } from '../../common/interfaces/EnvironmentControllerInterface';
import { Environment } from '../../main/generated/client';

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

export async function createEnvironment(
  environment: EnvironmentControllerInterface
): Promise<Environment> {
  const createdEnvironment = ipcRenderer.sendSync(
    'createEnvironment',
    environment
  );

  return createdEnvironment;
}
