import { ipcRenderer } from 'electron';
import EnvironmentDataInterface from '../interfaces/EnvironmentDataInterface';

const dbHandler = {
  environments: {
    getAll() {
      const storage = ipcRenderer.sendSync('getEnvironmentsFile');

      return storage.environments;
    },
    saveNew(environmentData: EnvironmentDataInterface) {
      const storage = ipcRenderer.sendSync('getEnvironmentsFile');

      storage.environments.push(environmentData);

      const result = ipcRenderer.sendSync(
        'updateEnvironmentsFile',
        JSON.stringify(storage)
      );
      if (!result) {
        throw new Error('Error updating database file');
      }
      return true;
    },
    getByUUID(uuid: string) {
      if (!uuid) {
        throw new Error('UUID is required');
      }

      let foundEnvironment = null;
      const environments = dbHandler.environments.getAll();

      if (environments.length > 0) {
        foundEnvironment = environments.find(
          (item: EnvironmentDataInterface) => {
            return item.uuid === uuid;
          }
        );

        if (typeof foundEnvironment !== 'undefined') {
          return foundEnvironment;
        }
      }

      return null;
    },
    updateByUUID(uuid: string, updatedEnvironment: EnvironmentDataInterface) {
      const storage = ipcRenderer.sendSync('getEnvironmentsFile');
      const { environments } = storage;

      const index = environments.findIndex(
        (element: EnvironmentDataInterface) => element.uuid === uuid
      );

      if (index === -1) {
        return false;
      }

      storage.environments[index] = updatedEnvironment;

      const result = ipcRenderer.sendSync(
        'updateEnvironmentsFile',
        JSON.stringify(storage)
      );
      if (!result) {
        throw new Error('Error updating database file');
      }
      return true;
    },
    deleteByUUID(uuid: string) {
      const storage = ipcRenderer.sendSync('getEnvironmentsFile');
      const { environments } = storage;

      environments.map((environment: EnvironmentDataInterface, idx: number) => {
        if (environment.uuid === uuid) {
          environments.splice(idx, 1);
          return true;
        }
        return false;
      });

      storage.environments = environments;

      const result = ipcRenderer.sendSync(
        'updateEnvironmentsFile',
        JSON.stringify(storage)
      );
      if (!result) {
        throw new Error('Error updating database file');
      }

      return true;
    },
  },
};

export default dbHandler;
