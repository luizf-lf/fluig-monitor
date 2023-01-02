import { ipcRenderer } from 'electron';
import { AppSetting } from '../../main/generated/client';
import {
  AppSettingCreateDefaultPropsInterface,
  AppSettingUpdatePropsInterface,
} from '../../main/controllers/SettingsController';

export async function updateAppSettings(
  settings: AppSettingUpdatePropsInterface[]
): Promise<AppSetting[]> {
  const updated = await ipcRenderer.invoke('updateSettings', settings);

  return updated;
}

export async function getAppSetting(
  settingId: string,
  createIfNotExists = false,
  createData: AppSettingCreateDefaultPropsInterface | null = null
): Promise<AppSetting | null> {
  const found = await ipcRenderer.invoke(
    'getSetting',
    settingId,
    createIfNotExists,
    createData
  );

  return found;
}
