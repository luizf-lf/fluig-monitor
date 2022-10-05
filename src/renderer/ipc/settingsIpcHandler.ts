import log from 'electron-log';
import { ipcRenderer } from 'electron';

export async function updateFrontEndTheme(theme: string): Promise<void> {
  log.info('IPC: Invoker: Updating front end theme to', theme);

  const updated = await ipcRenderer.invoke('updateFrontEndTheme', theme);

  return updated;
}

export async function getFrontEndTheme(): Promise<string> {
  log.info('IPC: Invoker: Getting front end theme');

  const theme = await ipcRenderer.invoke('getFrontEndTheme');

  return theme.value;
}
