/* eslint-disable @typescript-eslint/no-explicit-any */
import log from 'electron-log';
import EnvironmentController from '../controllers/EnvironmentController';
import AuthKeysDecoder from '../../common/classes/AuthKeysDecoder';
import FluigAPIClient from '../../common/classes/FluigAPIClient';
import LicenseHistoryController from '../controllers/LicenseHistoryController';
import { EnvironmentWithRelatedData } from '../../common/interfaces/EnvironmentControllerInterface';
import HttpResponseController from '../controllers/HttpResponseController';
import MonitorHistoryController from '../controllers/MonitorHistoryController';
import frequencyToMs from '../utils/frequencyToMs';
import StatisticsHistoryController from '../controllers/StatisticsHistoryController';
import { environmentSyncInterval } from '../utils/globalConstants';

/**
 * Fetch the license data from a Fluig server using the API /license/api/v1/licenses
 *  and saves the result to the database
 */
async function syncLicenseData(
  item: EnvironmentWithRelatedData
): Promise<void> {
  log.info('syncEnvironmentsJob: Fetching license data');
  if (item.oAuthKeysId) {
    const decodedKeys = new AuthKeysDecoder({
      hash: item.oAuthKeysId.hash,
      payload: item.oAuthKeysId.payload,
    }).decode();

    const requestData = {
      url: `${item.baseUrl}/license/api/v1/licenses`,
      method: 'GET',
    };

    const fluigClient = new FluigAPIClient({
      oAuthKeys: decodedKeys,
      requestData,
    });

    const initialTiming = Date.now();

    await fluigClient.get();

    const responseTimeMs = Date.now() - initialTiming;

    if (!fluigClient.hasError) {
      if (fluigClient.httpStatus === 200) {
        const { activeUsers, remainingLicenses, tenantId, totalLicenses } =
          fluigClient.httpResponse.items[0];

        const logged = await new LicenseHistoryController().new({
          environmentId: item.id,
          statusCode: fluigClient.httpStatus,
          timestamp: new Date().toISOString(),
          responseTimeMs,
          endpoint: requestData.url,
          statusMessage: fluigClient.httpStatusText,
          licenseData: {
            activeUsers,
            remainingLicenses,
            tenantId,
            totalLicenses,
          },
        });

        if (logged !== null) {
          log.info('syncEnvironmentsJob: License history logged successfully');
        }
      } else {
        log.warn(
          'syncEnvironmentsJob: Server error while fetching license data from environment',
          item.id,
          `(${fluigClient.httpStatus})`
        );
      }
    } else if (fluigClient.httpStatus) {
      log.warn(
        'syncEnvironmentsJob: Warning while syncing environment',
        item.id,
        ':',
        fluigClient.httpStatus,
        '(licenses api)'
      );
      await new HttpResponseController().new({
        environmentId: item.id,
        responseTimeMs,
        endpoint: requestData.url,
        statusCode: fluigClient.httpStatus,
        statusMessage: fluigClient.httpStatusText,
        timestamp: new Date().toISOString(),
      });
    } else {
      log.error(
        'syncEnvironmentsJob: Error while syncing environment',
        item.id,
        ':',
        fluigClient.errorStack,
        '(licenses api)'
      );

      await new HttpResponseController().new({
        environmentId: item.id,
        responseTimeMs: 0,
        endpoint: requestData.url,
        statusCode: 0,
        statusMessage: fluigClient.errorStack.split('\n')[0],
        timestamp: new Date().toISOString(),
      });
    }
  }
}

/**
 * Fetch the monitor data from the Fluig server using the API /monitoring/api/v1/monitors/report
 *  and saves the result to the database.
 */
async function syncMonitorData(
  item: EnvironmentWithRelatedData
): Promise<void> {
  log.info('syncEnvironmentsJob: Fetching monitor data');

  if (item.oAuthKeysId) {
    const decodedKeys = new AuthKeysDecoder({
      hash: item.oAuthKeysId.hash,
      payload: item.oAuthKeysId.payload,
    }).decode();

    const requestData = {
      url: `${item.baseUrl}/monitoring/api/v1/monitors/report`,
      method: 'GET',
    };

    const fluigClient = new FluigAPIClient({
      oAuthKeys: decodedKeys,
      requestData,
    });

    const initialTiming = Date.now();

    await fluigClient.get();

    const responseTimeMs = Date.now() - initialTiming;

    if (!fluigClient.hasError) {
      if (fluigClient.httpStatus === 200) {
        const monitorData = fluigClient.httpResponse.items;

        const logged = await new MonitorHistoryController().new({
          environmentId: item.id,
          statusCode: fluigClient.httpStatus,
          statusMessage: fluigClient.httpStatusText,
          timestamp: new Date().toISOString(),
          responseTimeMs,
          endpoint: requestData.url,
          monitorData,
        });

        if (logged !== null) {
          log.info('syncEnvironmentsJob: Monitor history logged successfully');
        }
      } else {
        log.warn(
          'syncEnvironmentsJob: Server error while fetching monitor data from environment',
          item.id,
          `(${fluigClient.httpStatus})`
        );
      }
    } else if (fluigClient.httpStatus) {
      log.warn(
        'syncEnvironmentsJob: Warning while syncing environment',
        item.id,
        ':',
        fluigClient.httpStatus,
        '(monitor api)'
      );
      await new HttpResponseController().new({
        environmentId: item.id,
        responseTimeMs,
        endpoint: requestData.url,
        statusCode: fluigClient.httpStatus,
        statusMessage: fluigClient.httpStatusText,
        timestamp: new Date().toISOString(),
      });
    } else {
      log.error(
        'syncEnvironmentsJob: Error while syncing environment',
        item.id,
        ':',
        fluigClient.errorStack,
        '(monitor api)'
      );

      await new HttpResponseController().new({
        environmentId: item.id,
        responseTimeMs: 0,
        endpoint: requestData.url,
        statusCode: 0,
        statusMessage: fluigClient.errorStack.split('\n')[0],
        timestamp: new Date().toISOString(),
      });
    }
  }
}

/**
 * Fetch the statistics report data from the Fluig server using the api /monitoring/api/v1/statistics/report
 *  and saves the result to the database
 */
async function syncStatisticsData(
  item: EnvironmentWithRelatedData
): Promise<void> {
  log.info('syncEnvironmentsJob: Fetching statistics data');

  if (item.oAuthKeysId) {
    const decodedKeys = new AuthKeysDecoder({
      hash: item.oAuthKeysId.hash,
      payload: item.oAuthKeysId.payload,
    }).decode();

    const requestData = {
      url: `${item.baseUrl}/monitoring/api/v1/statistics/report`,
      method: 'GET',
    };

    const fluigClient = new FluigAPIClient({
      oAuthKeys: decodedKeys,
      requestData,
    });

    const initialTiming = Date.now();

    await fluigClient.get();

    const responseTimeMs = Date.now() - initialTiming;

    if (!fluigClient.hasError) {
      if (fluigClient.httpStatus === 200) {
        const statisticsData = fluigClient.httpResponse;

        const logged = await new StatisticsHistoryController().new({
          environmentId: item.id,
          statusCode: fluigClient.httpStatus,
          statusMessage: fluigClient.httpStatusText,
          timestamp: new Date().toISOString(),
          responseTimeMs,
          endpoint: requestData.url,

          dataSourceFluigDs: JSON.stringify(statisticsData.DATA_SOURCE_FLUIGDS),
          dataSourceFluigDsRo: JSON.stringify(
            statisticsData.DATA_SOURCE_FLUIGDSRO
          ),
          dbName: statisticsData.DATABASE_INFO.databaseName,
          dbVersion: statisticsData.DATABASE_INFO.databaseVersion,
          dbDriverName: statisticsData.DATABASE_INFO.driverName,
          dbDriverVersion: statisticsData.DATABASE_INFO.driverVersion,
          connectedUsers: statisticsData.CONNECTED_USERS.connectedUsers,
          memoryHeap: statisticsData.MEMORY['heap-memory-usage'],
          nonMemoryHeap: statisticsData.MEMORY['non-heap-memory-usage'],
          dbTraficRecieved: statisticsData.DATABASE_TRAFFIC.received
            ? statisticsData.DATABASE_TRAFFIC.received
            : -1,
          dbTraficSent: statisticsData.DATABASE_TRAFFIC.sent
            ? statisticsData.DATABASE_TRAFFIC.sent
            : -1,
          dbSize: statisticsData.DATABASE_SIZE.size,
          artifactsApps: JSON.stringify(statisticsData.ARTIFACTS_APPS_DIR),
          artifactsCore: JSON.stringify(statisticsData.ARTIFACTS_CORE_DIR),
          artifactsSystem: JSON.stringify(statisticsData.ARTIFACTS_SYSTEM_DIR),
          externalConverter: statisticsData.EXTERNAL_CONVERTER.exists,
          runtimeStart: statisticsData.RUNTIME.startTime,
          runtimeUptime: statisticsData.RUNTIME.uptime,
          threadingCount: statisticsData.THREADING.count,
          threadingPeakCount: statisticsData.THREADING.peakCount,
          threadingDaemonCount: statisticsData.THREADING.deamonCount,
          threadingTotalStarted: statisticsData.THREADING.totalStartedCount,
          detailedMemory: JSON.stringify(statisticsData.DETAILED_MEMORY),
          systemServerMemorySize:
            statisticsData.OPERATION_SYSTEM['server-memory-size'],
          systemServerMemoryFree:
            statisticsData.OPERATION_SYSTEM['server-memory-free'],
          systemServerHDSize:
            statisticsData.OPERATION_SYSTEM['server-hd-space'],
          systemServerHDFree:
            statisticsData.OPERATION_SYSTEM['server-hd-space-free'],
          systemServerCoreCount:
            statisticsData.OPERATION_SYSTEM['server-core-system'],
          systemServerArch:
            statisticsData.OPERATION_SYSTEM['server-arch-system'],
          systemTmpFolderSize:
            statisticsData.OPERATION_SYSTEM['server-temp-size'],
          systemLogFolderSize:
            statisticsData.OPERATION_SYSTEM['server-log-size'],
          systemHeapMaxSize: statisticsData.OPERATION_SYSTEM['heap-max-size'],
          systemHeapSize: statisticsData.OPERATION_SYSTEM['heap-size'],
          systemUptime: statisticsData.OPERATION_SYSTEM['system-uptime'],
        });

        if (logged !== null) {
          log.info(
            'syncEnvironmentsJob: Statistics history logged successfully'
          );
        }
      } else {
        log.warn(
          'syncEnvironmentsJob: Server error while fetching statistics data from environment',
          item.id,
          `(${fluigClient.httpStatus})`
        );
      }
    } else if (fluigClient.httpStatus) {
      log.warn(
        'syncEnvironmentsJob: Warning while syncing environment',
        item.id,
        ':',
        fluigClient.httpStatus,
        '(statistics api)'
      );
      await new HttpResponseController().new({
        environmentId: item.id,
        responseTimeMs,
        endpoint: requestData.url,
        statusCode: fluigClient.httpStatus,
        statusMessage: fluigClient.httpStatusText,
        timestamp: new Date().toISOString(),
      });
    } else {
      log.error(
        'syncEnvironmentsJob: Error while syncing environment',
        item.id,
        ':',
        fluigClient.errorStack,
        '(statistics api)'
      );

      await new HttpResponseController().new({
        environmentId: item.id,
        responseTimeMs: 0,
        endpoint: requestData.url,
        statusCode: 0,
        statusMessage: fluigClient.errorStack.split('\n')[0],
        timestamp: new Date().toISOString(),
      });
    }
  }
}

/**
 * Handle the environment sync job.
 * It will check if the environment needs a synchronization according to the update schedule and
 *  http responses history.
 */
export default async function syncEnvironmentsJob() {
  // TODO: Alter sync strategy, since time periods and only on workdays have been removed

  return;
  log.info('syncEnvironmentsJob: Executing environment sync job');

  const environmentList = await new EnvironmentController().getAll();

  if (environmentList.length > 0) {
    environmentList.forEach(async (item) => {
      log.info(
        'syncEnvironmentsJob: Checking related data for environment',
        item.id
      );

      let needsSync = false;
      let isInUpdateSchedule = false;

      const date = new Date();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const timeNow = `${hours}:${minutes}`;
      const dayOfWeek = date.getDay();

      if (item.updateScheduleId) {
        if (
          timeNow > item.updateScheduleId.from &&
          timeNow < item.updateScheduleId.to
        ) {
          if (
            item.updateScheduleId.onlyOnWorkDays &&
            dayOfWeek >= 1 &&
            dayOfWeek <= 5
          ) {
            isInUpdateSchedule = true;
          } else if (!item.updateScheduleId.onlyOnWorkDays) {
            isInUpdateSchedule = true;
          }
        }

        if (isInUpdateSchedule) {
          log.info(
            'syncEnvironmentsJob: Environment',
            item.id,
            'is inside the update schedule.'
          );

          const lastHttpResponse =
            await new EnvironmentController().getLastHttpResponseById(
              item.id,
              true
            );

          if (
            lastHttpResponse === null ||
            lastHttpResponse.statusCode < 200 ||
            lastHttpResponse.statusCode > 300
          ) {
            log.info(
              'syncEnvironmentsJob: Environment',
              item.id,
              'has no successful http requests. Sync is needed.'
            );
            needsSync = true;
          } else if (
            Date.now() - lastHttpResponse.timestamp.getTime() >
            frequencyToMs(item.updateScheduleId.frequency)
          ) {
            log.info(
              'syncEnvironmentsJob: Environment',
              item.id,
              'has an old successful http response. Sync is needed.'
            );
            needsSync = true;
          }
        }

        if (needsSync) {
          log.info(
            'syncEnvironmentsJob: Environment',
            item.id,
            'needs synchronization. Fetching api data.'
          );
          await syncLicenseData(item);
          await syncMonitorData(item);
          await syncStatisticsData(item);

          log.info('syncEnvironmentsJob: Environment sync job finished.');
        } else {
          log.info(
            'syncEnvironmentsJob: Environment',
            item.id,
            'does not need synchronization.'
          );
        }
      } else {
        log.warn(
          'syncEnvironmentsJob: No environment update schedule found, skipping sync.'
        );
      }
    });
  } else {
    log.info('syncEnvironmentsJob: No environment found, skipping sync.');
  }

  log.info(
    'syncEnvironmentsJob: Next sync will occur at',
    new Date(Date.now() + environmentSyncInterval).toLocaleString()
  );
}
