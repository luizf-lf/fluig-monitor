import { ipcRenderer } from 'electron';
import { Environment } from '../../main/generated/client';

export async function getAllEnvironmentsIPC(): Promise<Environment[]> {
  const environments = ipcRenderer.sendSync('getAllEnvironments');

  return environments;
}

export async function getEnvironmentById(
  id: string
): Promise<Environment | null> {
  if (!id) {
    return null;
  }
  const environment = ipcRenderer.sendSync('getEnvironmentById', id);

  return environment;
}

export async function createEnvironment(
  environment: Environment
): Promise<Environment> {
  const createdEnvironment = ipcRenderer.sendSync(
    'createEnvironment',
    environment
  );

  return createdEnvironment;
}

// const dbHandler = {
//   environments: {
//     getAll() {
//       const storage = ipcRenderer.sendSync('getEnvironmentsFile');
//       return storage.environments;
//     },
//     saveNew(environmentData: EnvironmentDataInterface) {
//       const storage = ipcRenderer.sendSync('getEnvironmentsFile');
//       storage.environments.push(environmentData);
//       const result = ipcRenderer.sendSync(
//         'updateEnvironmentsFile',
//         JSON.stringify(storage)
//       );
//       if (!result) {
//         throw new Error('Error updating database file');
//       }
//       return true;
//     },
//     getByUUID(uuid: string) {
//       if (!uuid) {
//         throw new Error('UUID is required');
//       }
//       let foundEnvironment = null;
//       const environments = dbHandler.environments.getAll();
//       if (environments.length > 0) {
//         foundEnvironment = environments.find(
//           (item: EnvironmentDataInterface) => {
//             return item.uuid === uuid;
//           }
//         );
//         if (typeof foundEnvironment !== 'undefined') {
//           return foundEnvironment;
//         }
//       }
