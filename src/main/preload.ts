import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  // functions to be exposed (not yet used)
});
