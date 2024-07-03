/* eslint-disable @typescript-eslint/no-explicit-any */
import log from 'electron-log';
import { BrowserWindow } from 'electron';

import EnvironmentController from '../controllers/EnvironmentController';
import AuthKeysDecoder from '../../common/classes/AuthKeysDecoder';
import FluigAPIClient from '../../common/classes/FluigAPIClient';
import LicenseHistoryController from '../controllers/LicenseHistoryController';
import { EnvironmentWithRelatedData } from '../../common/interfaces/EnvironmentControllerInterface';
import HttpResponseController from '../controllers/HttpResponseController';
import MonitorHistoryController from '../controllers/MonitorHistoryController';
import frequencyToMs from '../utils/frequencyToMs';
import StatisticsHistoryController from '../controllers/StatisticsHistoryController';
import { scrapeSyncInterval } from '../utils/globalConstants';
import HttpResponseResourceType from '../../common/interfaces/HttpResponseResourceTypes';
import getEnvironmentRelease from './getEnvironmentRelease';
import assertConnectivity from '../utils/assertConnectivity';

/**
 * Fetch the license data from a Fluig server using the API /license/api/v1/licenses
 *  and saves the result to the database
 */
async function syncLicenseData(
  licenseHistoryController: LicenseHistoryController,
  httpResponseController: HttpResponseController,
  item: EnvironmentWithRelatedData,
  hostConnected: boolean
): Promise<void> {
  log.info('syncEnvironmentsJob: Fetching license data');
  if (item.oAuthKeysId) {
    const decodedKeys = new AuthKeysDecoder(item.oAuthKeysId).decode();

    if (!decodedKeys) {
      log.error(
        'syncLicenseData: Could not decode the environment keys, ignoring sync.'
      );
      return;
    }

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

        const logged = await licenseHistoryController.new({
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
          hostConnected,
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
      await httpResponseController.new({
        environmentId: item.id,
        responseTimeMs,
        endpoint: requestData.url,
        resourceType: HttpResponseResourceType.LICENSES,
        statusCode: fluigClient.httpStatus,
        statusMessage: fluigClient.httpStatusText,
        timestamp: new Date().toISOString(),
        hostConnected,
      });
    } else {
      log.error(
        'syncEnvironmentsJob: Error while syncing environment',
        item.id,
        ':',
        fluigClient.errorStack,
        '(licenses api)'
      );

      await httpResponseController.new({
        environmentId: item.id,
        responseTimeMs: 0,
        endpoint: requestData.url,
        resourceType: HttpResponseResourceType.LICENSES,
        statusCode: 0,
        statusMessage: fluigClient.errorStack.split('\n')[0],
        timestamp: new Date().toISOString(),
        hostConnected,
      });
    }
  }
}

/**
 * Fetch the monitor data from the Fluig server using the API /monitoring/api/v1/monitors/report
 *  and saves the result to the database.
 */
async function syncMonitorData(
  monitorHistoryController: MonitorHistoryController,
  httpResponseController: HttpResponseController,
  item: EnvironmentWithRelatedData,
  hostConnected: boolean
): Promise<void> {
  log.info('syncEnvironmentsJob: Fetching monitor data');

  if (item.oAuthKeysId) {
    const decodedKeys = new AuthKeysDecoder(item.oAuthKeysId).decode();

    if (!decodedKeys) {
      log.error(
        'syncMonitorData: Could not decode the environment keys, ignoring sync.'
      );
      return;
    }

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

        const logged = await monitorHistoryController.new({
          environmentId: item.id,
          statusCode: fluigClient.httpStatus,
          statusMessage: fluigClient.httpStatusText,
          timestamp: new Date().toISOString(),
          responseTimeMs,
          endpoint: requestData.url,
          monitorData,
          hostConnected,
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
      await httpResponseController.new({
        environmentId: item.id,
        responseTimeMs,
        endpoint: requestData.url,
        resourceType: HttpResponseResourceType.MONITOR,
        statusCode: fluigClient.httpStatus,
        statusMessage: fluigClient.httpStatusText,
        timestamp: new Date().toISOString(),
        hostConnected,
      });
    } else {
      log.error(
        'syncEnvironmentsJob: Error while syncing environment',
        item.id,
        ':',
        fluigClient.errorStack,
        '(monitor api)'
      );

      await httpResponseController.new({
        environmentId: item.id,
        responseTimeMs: 0,
        endpoint: requestData.url,
        resourceType: HttpResponseResourceType.MONITOR,
        statusCode: 0,
        statusMessage: fluigClient.errorStack.split('\n')[0],
        timestamp: new Date().toISOString(),
        hostConnected,
      });
    }
  }
}

/**
 * Fetch the statistics report data from the Fluig server using the api /monitoring/api/v1/statistics/report
 *  and saves the result to the database
 */
async function syncStatisticsData(
  statisticsHistoryController: StatisticsHistoryController,
  httpResponseController: HttpResponseController,
  item: EnvironmentWithRelatedData,
  hostConnected: boolean
): Promise<void> {
  try {
    log.info('syncEnvironmentsJob: Fetching statistics data');

    if (item.oAuthKeysId) {
      const decodedKeys = new AuthKeysDecoder(item.oAuthKeysId).decode();

      if (!decodedKeys) {
        log.error(
          'syncStatisticsData: Could not decode the environment keys, ignoring sync.'
        );
        return;
      }

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

          const logged = await statisticsHistoryController.new({
            environmentId: item.id,
            statusCode: fluigClient.httpStatus,
            statusMessage: fluigClient.httpStatusText,
            timestamp: new Date().toISOString(),
            responseTimeMs,
            endpoint: requestData.url,
            hostConnected,

            dataSourceFluigDs: JSON.stringify(
              statisticsData.DATA_SOURCE_FLUIGDS
            ),
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
            dbSize:
              typeof statisticsData.DATABASE_SIZE.size === 'string'
                ? 0
                : statisticsData.DATABASE_SIZE.size,
            artifactsApps: JSON.stringify(statisticsData.ARTIFACTS_APPS_DIR),
            artifactsCore: JSON.stringify(statisticsData.ARTIFACTS_CORE_DIR),
            artifactsSystem: JSON.stringify(
              statisticsData.ARTIFACTS_SYSTEM_DIR
            ),
            externalConverter: statisticsData.EXTERNAL_CONVERTER.exists,
            runtimeStart: statisticsData.RUNTIME.startTime,
            runtimeUptime: statisticsData.RUNTIME.uptime,
            threadingCount: statisticsData.THREADING.count,
            threadingPeakCount: statisticsData.THREADING.peakCount,
            threadingDaemonCount: statisticsData.THREADING.deamonCount,
            threadingTotalStarted: statisticsData.THREADING.totalStartedCount,
            detailedMemory: JSON.stringify(statisticsData.DETAILED_MEMORY),
            systemServerMemorySize: statisticsData.OPERATION_SYSTEM
              ? statisticsData.OPERATION_SYSTEM['server-memory-size']
              : null,
            systemServerMemoryFree: statisticsData.OPERATION_SYSTEM
              ? statisticsData.OPERATION_SYSTEM['server-memory-free']
              : null,
            systemServerHDSize: statisticsData.OPERATION_SYSTEM
              ? statisticsData.OPERATION_SYSTEM['server-hd-space']
              : null,
            systemServerHDFree: statisticsData.OPERATION_SYSTEM
              ? statisticsData.OPERATION_SYSTEM['server-hd-space-free']
              : null,
            systemServerCoreCount: statisticsData.OPERATION_SYSTEM
              ? statisticsData.OPERATION_SYSTEM['server-core-system']
              : null,
            systemServerArch: statisticsData.OPERATION_SYSTEM
              ? statisticsData.OPERATION_SYSTEM['server-arch-system']
              : null,
            systemTmpFolderSize: statisticsData.OPERATION_SYSTEM
              ? statisticsData.OPERATION_SYSTEM['server-temp-size']
              : null,
            systemLogFolderSize: statisticsData.OPERATION_SYSTEM
              ? statisticsData.OPERATION_SYSTEM['server-log-size']
              : null,
            systemHeapMaxSize: statisticsData.OPERATION_SYSTEM
              ? statisticsData.OPERATION_SYSTEM['heap-max-size']
              : null,
            systemHeapSize: statisticsData.OPERATION_SYSTEM
              ? statisticsData.OPERATION_SYSTEM['heap-size']
              : null,
            systemUptime: statisticsData.OPERATION_SYSTEM
              ? statisticsData.OPERATION_SYSTEM['system-uptime']
              : null,
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
        await httpResponseController.new({
          environmentId: item.id,
          responseTimeMs,
          endpoint: requestData.url,
          resourceType: HttpResponseResourceType.STATISTICS,
          statusCode: fluigClient.httpStatus,
          statusMessage: fluigClient.httpStatusText,
          timestamp: new Date().toISOString(),
          hostConnected,
        });
      } else {
        log.error(
          'syncEnvironmentsJob: Error while syncing environment',
          item.id,
          ':',
          fluigClient.errorStack,
          '(statistics api)'
        );

        await httpResponseController.new({
          environmentId: item.id,
          responseTimeMs: 0,
          endpoint: requestData.url,
          resourceType: HttpResponseResourceType.STATISTICS,
          statusCode: 0,
          statusMessage: fluigClient.errorStack.split('\n')[0],
          timestamp: new Date().toISOString(),
          hostConnected,
        });
      }
    }
  } catch (error) {
    log.error(`Unknown error on syncStatisticsData: ${error}`);
  }
}

async function syncProductVersion(
  environmentController: EnvironmentController,
  environment: EnvironmentWithRelatedData
): Promise<void> {
  try {
    log.info(
      `syncEnvironmentsJob: Updating fluig version for environment ${environment.id}`
    );

    if (environment.oAuthKeysId) {
      const decodedKeys = new AuthKeysDecoder(environment.oAuthKeysId).decode();

      if (!decodedKeys) {
        log.error(
          'syncProductVersion: Could not decode the environment keys, ignoring sync.'
        );
        return;
      }

      const release = await getEnvironmentRelease(
        decodedKeys,
        environment.baseUrl
      );

      if (release) {
        const releaseName = release.content.split(' - ')[1];
        if (releaseName.trim() !== environment.release.trim()) {
          await environmentController.updateRelease(
            environment.id,
            releaseName
          );
        }
      }
    }
  } catch (error) {
    log.error(`Error on syncProductVersion: ${error}`);
  }
}

/**
 * Handle the environment sync job.
 * It will check if the environment needs a synchronization according to the update schedule and
 *  http responses history.
 */
export default async function syncEnvironmentsJob() {
  log.info('syncEnvironmentsJob: Executing environment sync job');

  log.info(
    `syncEnvironmentsJob: Next sync will occur at ${new Date(
      Date.now() + scrapeSyncInterval
    ).toLocaleString()}`
  );

  const environmentController = new EnvironmentController();
  const statisticsHistoryController = new StatisticsHistoryController();
  const monitorHistoryController = new MonitorHistoryController();
  const licenseHistoryController = new LicenseHistoryController();
  const httpResponseController = new HttpResponseController();

  const environmentList = await environmentController.getAll();

  if (environmentList.length > 0) {
    environmentList.forEach(async (environment) => {
      log.info(
        `syncEnvironmentsJob: Checking related data for environment ${environment.id}`
      );

      let needsSync = false;

      if (environment.updateScheduleId) {
        const lastHttpResponse =
          await environmentController.getLastScrapeResponseById(environment.id);

        if (
          lastHttpResponse === null ||
          lastHttpResponse.statusCode < 200 ||
          lastHttpResponse.statusCode > 300
        ) {
          log.info(
            `syncEnvironmentsJob: Environment ${environment.id} has no successful http requests. Sync is needed.`
          );
          needsSync = true;
        } else if (
          Date.now() - lastHttpResponse.timestamp.getTime() >
          frequencyToMs(environment.updateScheduleId.scrapeFrequency)
        ) {
          log.info(
            `syncEnvironmentsJob: Environment ${environment.id} has an old successful http response. Sync is needed.`
          );
          needsSync = true;
        }

        if (needsSync) {
          log.info(
            `syncEnvironmentsJob: Environment ${environment.id} needs synchronization. Fetching api data.`
          );

          // TODO: Add analytics to sync events
          // TODO: Create analytics helper (abstract events to functions)

          const hostConnected = await assertConnectivity();
          await syncLicenseData(
            licenseHistoryController,
            httpResponseController,
            environment,
            hostConnected
          );
          await syncMonitorData(
            monitorHistoryController,
            httpResponseController,
            environment,
            hostConnected
          );
          await syncStatisticsData(
            statisticsHistoryController,
            httpResponseController,
            environment,
            hostConnected
          );
          await syncProductVersion(environmentController, environment);

          // sends a signal to the renderer with the server status as an argument
          BrowserWindow.getAllWindows().forEach((windowElement) => {
            windowElement.webContents.send(
              `environmentDataUpdated_${environment.id}`,
              {
                syncJobFinished: true,
              }
            );
          });

          log.info('syncEnvironmentsJob: Environment sync job finished.');
        } else {
          log.info(
            `syncEnvironmentsJob: Environment ${environment.id} does not need synchronization.`
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
}
