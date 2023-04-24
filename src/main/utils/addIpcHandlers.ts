/* eslint-disable no-await-in-loop */
import log from 'electron-log';
import { ipcMain } from 'electron';
import Store from 'electron-store';

import { AppSetting } from '../generated/client';
import { AuthKeysControllerInterface } from '../../common/interfaces/AuthKeysControllerInterface';
import { EnvironmentUpdateControllerInterface } from '../../common/interfaces/EnvironmentControllerInterface';
import { UpdateScheduleControllerInterface } from '../../common/interfaces/UpdateScheduleControllerInterface';

import AuthKeysController from '../controllers/AuthKeysController';
import EnvironmentController from '../controllers/EnvironmentController';
import LanguageController from '../controllers/LanguageController';
import LogController from '../controllers/LogController';
import SettingsController, {
  AppSettingUpdatePropsInterface,
  SettingsObject,
} from '../controllers/SettingsController';
import StatisticsHistoryController from '../controllers/StatisticsHistoryController';
import UpdateScheduleController from '../controllers/UpdateScheduleController';
import LicenseHistoryController from '../controllers/LicenseHistoryController';

import pingEnvironmentsJob from '../services/pingEnvironmentsJob';
import syncEnvironmentsJob from '../services/syncEnvironmentsJob';

import { CreateEnvironmentProps } from '../../renderer/ipc/environmentsIpcHandler';

import { isDevelopment, logStringFormat } from './globalConstants';
import validateOAuthPermission from '../services/validateOAuthPermission';
import getEnvironmentRelease, {
  V2VersionApiResponse,
} from '../services/getEnvironmentRelease';
import AuthObject from '../../common/interfaces/AuthObject';
import i18n from '../../common/i18n/i18n';
import AppUpdater, {
  AppUpdaterConstructorOptions,
} from '../classes/AppUpdater';

/**
 * Adds all of the Inter Process Communication listeners and handlers needed by the main process
 * @since 0.2.1
 */
export default function addIpcHandlers(): void {
  ipcMain.on('getAllEnvironments', async (event) => {
    log.info('IPC Listener: Recovering all environments');
    event.returnValue = await new EnvironmentController().getAll();
  });

  ipcMain.on('getLanguage', async (event) => {
    log.info('IPC Listener: Recovering user language');
    event.returnValue = await new LanguageController().get();
  });

  ipcMain.on('getIsDevelopment', (event) => {
    event.returnValue = isDevelopment;
  });
  ipcMain.on('getLogStringFormat', (event) => {
    event.returnValue = logStringFormat;
  });

  ipcMain.handle(
    'getEnvironmentById',
    async (
      _event: Electron.IpcMainInvokeEvent,
      id: number,
      includeRelatedData: boolean
    ) => {
      log.info('IPC Handler: Recovering environment by id');
      const environment = await new EnvironmentController().getById(
        id,
        includeRelatedData
      );

      return environment;
    }
  );

  ipcMain.handle(
    'getHttpResponsesById',
    async (_event: Electron.IpcMainInvokeEvent, id: number) => {
      const responses = await new EnvironmentController().getHttpResponsesById(
        id
      );

      return responses;
    }
  );

  ipcMain.handle(
    'getEnvironmentHistoryById',
    async (_event: Electron.IpcMainInvokeEvent, id: number) => {
      const environment = await new EnvironmentController().getHistoryById(id);
      return environment;
    }
  );

  ipcMain.handle(
    'getEnvironmentServerData',
    async (_event: Electron.IpcMainInvokeEvent, id: number) => {
      const serverData = await EnvironmentController.getEnvironmentServerData(
        id
      );
      return serverData;
    }
  );

  ipcMain.handle(
    'createEnvironment',
    async (
      _event: Electron.IpcMainInvokeEvent,
      {
        environment,
        updateSchedule,
        environmentAuthKeys,
      }: CreateEnvironmentProps
    ) => {
      log.info('IPC Handler: Creating a new environment');

      const createdEnvironment = await new EnvironmentController().new(
        environment
      );
      const createdUpdateSchedule = await new UpdateScheduleController().new({
        environmentId: createdEnvironment.id,
        pingFrequency: updateSchedule.pingFrequency,
        scrapeFrequency: updateSchedule.scrapeFrequency,
      });
      const createdAuthKeys = await new AuthKeysController().new({
        environmentId: createdEnvironment.id,
        payload: environmentAuthKeys.payload,
        hash: environmentAuthKeys.hash,
      });

      await new LogController().writeLog({
        type: 'info',
        message: `Environment ${createdEnvironment.id} created with related data via ipcMain handler`,
      });

      return { createdEnvironment, createdUpdateSchedule, createdAuthKeys };
    }
  );

  ipcMain.handle(
    'updateEnvironment',
    async (
      _event: Electron.IpcMainInvokeEvent,
      environment: EnvironmentUpdateControllerInterface,
      updateSchedule: UpdateScheduleControllerInterface,
      authKeys: AuthKeysControllerInterface
    ) => {
      log.info('IPC Handler: Updating an environment');

      const updatedEnvironment = await new EnvironmentController().update(
        environment
      );
      const updatedUpdateSchedule = await new UpdateScheduleController().update(
        updateSchedule
      );
      const updatedAuthKeys = await new AuthKeysController().update(authKeys);

      await new LogController().writeLog({
        type: 'info',
        message: `Environment ${updatedEnvironment.id} updated with related data via ipcMain handler`,
      });

      return { updatedEnvironment, updatedUpdateSchedule, updatedAuthKeys };
    }
  );

  ipcMain.handle(
    'deleteEnvironment',
    async (_event: Electron.IpcMainInvokeEvent, id: number) => {
      log.info('IPC Handler: Deleting environment');

      const deleted = await new EnvironmentController().delete(id);

      await new LogController().writeLog({
        type: 'info',
        message: `Environment ${deleted.id} deleted logically via ipcMain handler`,
      });

      return deleted;
    }
  );

  ipcMain.handle(
    'toggleEnvironmentFavorite',
    async (_event: Electron.IpcMainInvokeEvent, id: number) => {
      log.info(
        `IPC Handler: Toggling environment favorite for environment with a id of ${id}`
      );

      const favorited = await EnvironmentController.toggleFavorite(id);

      return favorited;
    }
  );

  ipcMain.handle(
    'updateSettings',
    async (
      _event: Electron.IpcMainInvokeEvent,
      settings: AppSettingUpdatePropsInterface[]
    ): Promise<AppSetting[]> => {
      const settingsController = new SettingsController();
      const updated = [];

      for (let i = 0; i < settings.length; i += 1) {
        updated.push(await settingsController.update(settings[i]));
      }

      return updated;
    }
  );

  ipcMain.handle(
    'getSetting',
    async (
      _event: Electron.IpcMainInvokeEvent,
      settingId: string
    ): Promise<AppSetting | null> => {
      const found = await new SettingsController().find(settingId);

      return found;
    }
  );

  ipcMain.handle(
    'getSettingsAsObject',
    async (/** _event: Electron.IpcMainInvokeEvent */): Promise<SettingsObject> => {
      const found = await new SettingsController().getAllAsObject();

      return found;
    }
  );

  ipcMain.handle(
    'getLastHttpResponseFromEnvironment',
    async (_event: Electron.IpcMainInvokeEvent, environmentId: number) => {
      const lastResponse =
        await new EnvironmentController().getLastHttpResponseById(
          environmentId
        );

      return lastResponse;
    }
  );

  ipcMain.handle(
    'getDiskInfo',
    async (_event: Electron.IpcMainInvokeEvent, id: number) => {
      log.info(`IPC Handler: Recovering disk info for environment ${id}`);

      const diskInfo = await StatisticsHistoryController.getDiskInfo(id);

      return diskInfo;
    }
  );

  ipcMain.handle(
    'getMemoryInfo',
    async (_event: Electron.IpcMainInvokeEvent, id: number) => {
      log.info(`IPC Handler: Recovering memory info for environment ${id}`);

      const memoryInfo = await StatisticsHistoryController.getMemoryInfo(id);

      return memoryInfo;
    }
  );

  ipcMain.handle(
    'getDatabaseInfo',
    async (_event: Electron.IpcMainInvokeEvent, id: number) => {
      log.info(`IPC Handler: Recovering database info for environment ${id}`);

      const dbInfo = await StatisticsHistoryController.getDatabaseInfo(id);

      return dbInfo;
    }
  );

  ipcMain.handle(
    'getDatabaseProperties',
    async (_event: Electron.IpcMainInvokeEvent, id: number) => {
      log.info(`IPC Handler: Recovering database props for environment ${id}`);

      const dbProps = await StatisticsHistoryController.getDatabaseProperties(
        id
      );

      return dbProps;
    }
  );

  ipcMain.handle(
    'getDatabaseStatisticsHistory',
    async (_event: Electron.IpcMainInvokeEvent, id: number) => {
      log.info(
        `IPC Handler: Recovering database statistics history for environment ${id}`
      );

      const dbProps =
        await StatisticsHistoryController.getDatabaseStatisticsHistory(id);

      return dbProps;
    }
  );

  ipcMain.handle(
    'getLastEnvironmentLicenseData',
    async (_event: Electron.IpcMainInvokeEvent, id: number) => {
      log.info(
        `IPC Handler: Recovering last license data for environment ${id}`
      );

      const licenseData = await LicenseHistoryController.getLastLicenseData(id);

      return licenseData;
    }
  );

  ipcMain.handle('forceEnvironmentSync', async () => {
    log.info('IPC Handler: Forcing all environments sync');
    await syncEnvironmentsJob();
  });

  ipcMain.handle('forceEnvironmentPing', async () => {
    log.info('IPC Handler: Forcing all environments ping');
    await pingEnvironmentsJob();
  });

  ipcMain.handle(
    'validateOauthPermission',
    async (
      _event: Electron.IpcMainInvokeEvent,
      auth: AuthObject,
      domainUrl: string
    ) => {
      log.info('IPC Handler: Validating oAuth permissions');
      const result = await validateOAuthPermission(auth, domainUrl);

      return result;
    }
  );

  ipcMain.handle(
    'getEnvironmentRelease',
    async (
      _event: Electron.IpcMainInvokeEvent,
      auth: AuthObject,
      domainUrl: string
    ): Promise<V2VersionApiResponse | null> => {
      log.info('IPC Handler: Getting the environment release');
      const result = await getEnvironmentRelease(auth, domainUrl);

      return result;
    }
  );

  ipcMain.handle(
    'setStoreValue',
    (_event: Electron.IpcMainInvokeEvent, key: string, value: string) => {
      new Store().set(key, value);
    }
  );

  ipcMain.handle(
    'updateLanguage',
    (_event: Electron.IpcMainInvokeEvent, lang: string) => {
      i18n.changeLanguage(lang);
    }
  );

  ipcMain.handle(
    'callAppUpdater',
    (
      _event: Electron.IpcMainInvokeEvent,
      options: AppUpdaterConstructorOptions
    ) => {
      new AppUpdater(options).checkUpdates();
    }
  );
}
