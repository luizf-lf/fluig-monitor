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
  },
};

export default dbHandler;
