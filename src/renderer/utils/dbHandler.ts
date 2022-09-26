import { ipcRenderer } from 'electron';
import EnvironmentDataInterface from '../../common/interfaces/EnvironmentDataInterface';

// TODO: Update handler to properly use the database
const dbHandler = {
  environments: {
    getAll() {
      //
    },
    saveNew(environmentData: EnvironmentDataInterface) {
      //
    },
    getByUUID(uuid: string) {
      if (!uuid) {
        throw new Error('UUID is required');
      }

      //

      return null;
    },
    updateByUUID(uuid: string, updatedEnvironment: EnvironmentDataInterface) {
      //
      return true;
    },
    deleteByUUID(uuid: string) {
      //

      return true;
    },
  },
};

export default dbHandler;
