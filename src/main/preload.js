const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // functions to be exposed
});
