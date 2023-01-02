import { ipcRenderer } from 'electron';
import { AppSetting } from '../../main/generated/client';
import { AppSettingUpdatePropsInterface } from '../../main/controllers/SettingsController';

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
