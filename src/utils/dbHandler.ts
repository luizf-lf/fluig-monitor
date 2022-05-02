import { ipcRenderer } from 'electron';
import AmbientDataInterface from '../renderer/interfaces/AmbientDataInterface';

const dbHandler = {
  ambients: {
    getAll() {
      const storage = ipcRenderer.sendSync('getAmbientsFile');

      return storage.ambients;
    },
    saveNew(ambientData: AmbientDataInterface) {
      const storage = ipcRenderer.sendSync('getAmbientsFile');

      storage.ambients.push(ambientData);

      const result = ipcRenderer.sendSync(
        'updateAmbientsFile',
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

      let foundAmbient = null;
      const ambients = dbHandler.ambients.getAll();

      if (ambients.length > 0) {
        foundAmbient = ambients.find((item: AmbientDataInterface) => {
          return item.uuid === uuid;
        });

        if (typeof foundAmbient !== 'undefined') {
          return foundAmbient;
        }
      }

      return null;
    },
    updateByUUID(uuid: string, updatedAmbient: AmbientDataInterface) {
      const storage = ipcRenderer.sendSync('getAmbientsFile');
      const { ambients } = storage;

      const index = ambients.findIndex(
        (element: AmbientDataInterface) => element.uuid === uuid
      );

      if (index === -1) {
        return false;
      }

      storage.ambients[index] = updatedAmbient;

      const result = ipcRenderer.sendSync(
        'updateAmbientsFile',
        JSON.stringify(storage)
      );
      if (!result) {
        throw new Error('Error updating database file');
      }
      return true;
    },
    deleteByUUID(uuid: string) {
      const storage = JSON.parse(ipcRenderer.sendSync('getAmbientsFile'));
      const { ambients } = storage;

      ambients.map((ambient: AmbientDataInterface, idx: number) => {
        if (ambient.uuid === uuid) {
          ambients.splice(idx, 1);
          return true;
        }
        return false;
      });

      storage.ambients = ambients;

      const result = ipcRenderer.sendSync(
        'updateAmbientsFile',
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
