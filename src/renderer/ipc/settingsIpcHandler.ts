import { ipcRenderer } from 'electron';

export async function updateFrontEndTheme(theme: string): Promise<void> {
  const updated = await ipcRenderer.invoke('updateFrontEndTheme', theme);

  return updated;
}

export async function getFrontEndTheme(): Promise<string> {
  const theme = await ipcRenderer.invoke('getFrontEndTheme');

  return theme.value;
}
