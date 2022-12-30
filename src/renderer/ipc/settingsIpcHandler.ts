import { ipcRenderer } from 'electron';
import { AppSetting } from '../../main/generated/client';
import { AppSettingUpdatePropsInterface } from '../../main/controllers/SettingsController';

/**
 * @deprecated in favor of updateAppSettings
 */
export async function updateFrontEndTheme(theme: string): Promise<void> {
  const updated = await ipcRenderer.invoke('updateFrontEndTheme', theme);

  return updated;
}

/**
 * @deprecated in favor of getSetting
 */
export async function getFrontEndTheme(): Promise<string> {
  const theme = await ipcRenderer.invoke('getFrontEndTheme');

  return theme.value;
}

export async function updateAppSettings(
  settings: AppSettingUpdatePropsInterface[]
): Promise<AppSetting[]> {
  const updated = await ipcRenderer.invoke('updateSettings', settings);

  return updated;
}

export async function getAppSetting(
  settingId: string
): Promise<AppSetting | null> {
  const found = await ipcRenderer.invoke('getSetting', settingId);

  return found;
}
