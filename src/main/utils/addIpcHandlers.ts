import log from 'electron-log';
import { ipcMain } from 'electron';

import { AuthKeysControllerInterface } from '../../common/interfaces/AuthKeysControllerInterface';
import { EnvironmentUpdateControllerInterface } from '../../common/interfaces/EnvironmentControllerInterface';
import { UpdateScheduleControllerInterface } from '../../common/interfaces/UpdateScheduleControllerInterface';

import AuthKeysController from '../controllers/AuthKeysController';
import EnvironmentController from '../controllers/EnvironmentController';
import LanguageController from '../controllers/LanguageController';
import LogController from '../controllers/LogController';
import SettingsController from '../controllers/SettingsController';
import StatisticsHistoryController from '../controllers/StatisticsHistoryController';
import UpdateScheduleController from '../controllers/UpdateScheduleController';

import pingEnvironmentsJob from '../jobs/pingEnvironmentsJob';
import syncEnvironmentsJob from '../jobs/syncEnvironmentsJob';

import { CreateEnvironmentProps } from '../../renderer/ipc/environmentsIpcHandler';

import { isDevelopment, logStringFormat } from './globalConstants';
import validateOAuthPermission, { AuthObject } from './validateOAuthPermission';

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
    'getEnvironmentHistoryById',
    async (_event: Electron.IpcMainInvokeEvent, id: number) => {
      const environment = await new EnvironmentController().getHistoryById(id);
      return environment;
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
      log.info('IPC Handler: Saving environment');

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
        hash: 'json',
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
      log.info('IPC Handler: Updating environment');

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
        'IPC Handler: Toggling environment favorite for environment id',
        id
      );

      const favorited = await EnvironmentController.toggleFavorite(id);

      return favorited;
    }
  );

  ipcMain.handle(
    'updateFrontEndTheme',
    async (_event: Electron.IpcMainInvokeEvent, theme: string) => {
      log.info('IPC Handler: Updating front end theme');

      const updated = await new SettingsController().update({
        settingId: 'FRONT_END_THEME',
        value: theme,
      });

      return updated;
    }
  );

  ipcMain.handle(
    'getLastHttpResponseFromEnvironment',
    async (_event: Electron.IpcMainInvokeEvent, environmentId: number) => {
      log.info(
        'IPC Handler: Recovering last HTTP Response from environment',
        environmentId
      );

      const lastResponse =
        await new EnvironmentController().getLastHttpResponseById(
          environmentId
        );

      return lastResponse;
    }
  );

  ipcMain.handle('getFrontEndTheme', async () => {
    log.info('IPC Handler: Getting front end theme');

    const theme = await new SettingsController().find('FRONT_END_THEME');

    return theme;
  });

  ipcMain.handle(
    'getHistoricalDiskInfo',
    async (_event: Electron.IpcMainInvokeEvent, id: number) => {
      log.info('IPC Handler: Getting historical disk info');

      const diskInfo = await StatisticsHistoryController.getHistoricalDiskInfo(
        id
      );

      return diskInfo;
    }
  );

  ipcMain.handle(
    'getHistoricalMemoryInfo',
    async (_event: Electron.IpcMainInvokeEvent, id: number) => {
      log.info('IPC Handler: Getting historical memory info');

      const memoryInfo =
        await StatisticsHistoryController.getHistoricalMemoryInfo(id);

      return memoryInfo;
    }
  );

  ipcMain.handle(
    'getHistoricalDatabaseInfo',
    async (_event: Electron.IpcMainInvokeEvent, id: number) => {
      log.info('IPC Handler: Getting historical database info');

      const dbInfo =
        await StatisticsHistoryController.getHistoricalDatabaseInfo(id);

      return dbInfo;
    }
  );

  ipcMain.handle('forceEnvironmentSync', async () => {
    log.info('IPC Handler: Forcing all environments Sync');
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
      const result = await validateOAuthPermission(auth, domainUrl);

      return result;
    }
  );
}