import { ipcRenderer } from 'electron';
import DatabaseInterface from '../renderer/interfaces/DatabaseInterface';
import AmbientDataInterface from '../renderer/interfaces/AmbientDataInterface';

const dbHandler = {
  global: {
    initData() {
      const initData: DatabaseInterface = {
        userSettings: {
          theme: 'LIGHT',
          openOnLastServer: false,
        },
        ambients: [],
        monitoringHistory: [],
      };

      const result = ipcRenderer.sendSync(
        'update-db-file',
        JSON.stringify(initData)
      );
      if (!result) {
        throw new Error('Error initializing database file');
      }

      return initData;
    },
  },
  ambients: {
    getAll() {
      let ambients = [];
      const storage = ipcRenderer.sendSync('get-db-file');

      if (storage !== null) {
        ambients = JSON.parse(storage).ambients;
      } else {
        ambients = dbHandler.global.initData().ambients;
      }

      return ambients;
    },
    saveNew(ambientData: AmbientDataInterface) {
      let storage = ipcRenderer.sendSync('get-db-file');

      if (storage !== null) {
        storage = JSON.parse(storage);
      } else {
        storage = dbHandler.global.initData();
      }

      storage.ambients.push(ambientData);

      const result = ipcRenderer.sendSync(
        'update-db-file',
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
      const storage = JSON.parse(ipcRenderer.sendSync('get-db-file'));
      const { ambients } = storage;

      const index = ambients.findIndex(
        (element: AmbientDataInterface) => element.uuid === uuid
      );

      if (index === -1) {
        return false;
      }

      storage.ambients[index] = updatedAmbient;

      const result = ipcRenderer.sendSync(
        'update-db-file',
        JSON.stringify(storage)
      );
      if (!result) {
        throw new Error('Error updating database file');
      }
      return true;
    },
    deleteByUUID(uuid: string) {
      const storage = JSON.parse(ipcRenderer.sendSync('get-db-file'));
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
        'update-db-file',
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
