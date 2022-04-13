import { ipcRenderer } from 'electron';
import AmbientDataInterface from '../renderer/interfaces/AmbientDataInterface';

// TODO: use ipcRenderer to get/save data to local file
const dbHandler = {
  ambients: {
    getAll() {
      let ambients = [];
      const storage = localStorage.getItem('FM_ambients');

      if (storage !== null) {
        ambients = JSON.parse(storage);
      }

      // sends a synchronous IPC message to the IPC listener on the 'main' process
      //  requesting the data provided by the 'getPath' method, which itself is
      //  a custom method implemented to return the user path from the 'main' process.
      // console.log(ipcRenderer.sendSync('get-user-data-folder', 'getPath'));
      // const result = ipcRenderer.sendSync('update-db-file', ambients);

      // TODO: Re-evaluate and remove from 'getAll' method
      // if (!result) {
      //   throw new Error('Error while saving settings file');
      // }

      return ambients;
    },
    saveNew(ambientData: AmbientDataInterface) {
      let ambients = [];
      const storage = localStorage.getItem('FM_ambients');

      if (storage !== null) {
        ambients = JSON.parse(storage);
      }

      ambients.push(ambientData);

      localStorage.setItem('FM_ambients', JSON.stringify(ambients));
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
