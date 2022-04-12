import AmbientDataInterface from '../renderer/interfaces/AmbientDataInterface';

const dbHandler = {
  ambients: {
    getAll() {
      let ambients = [];
      const storage = localStorage.getItem('FM_ambients');

      if (storage !== null) {
        ambients = JSON.parse(storage);
      }

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
