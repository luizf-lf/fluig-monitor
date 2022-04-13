import { ipcRenderer } from 'electron';
import AmbientDataInterface from '../renderer/interfaces/AmbientDataInterface';

const dbHandler = {
  global: {
    initData() {
      const initData = {
        userSettings: {},
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
        dbHandler.global.initData();
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
  },
};

export default dbHandler;
