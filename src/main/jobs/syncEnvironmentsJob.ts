/* eslint-disable @typescript-eslint/no-explicit-any */
import log from 'electron-log';
import EnvironmentController from '../controllers/EnvironmentController';
import AuthKeysDecoder from '../../common/classes/AuthKeysDecoder';
import FluigAPIClient from '../../common/classes/FluigAPIClient';
import LicenseHistoryController from '../controllers/LicenseHistoryController';
import LogController from '../controllers/LogController';
import { EnvironmentWithRelatedData } from '../../common/interfaces/EnvironmentControllerInterface';
import HttpResponseController from '../controllers/HttpResponseController';
import MonitorHistoryController from '../controllers/MonitorHistoryController';
import frequencyToMs from '../utils/frequencyToMs';

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
          licenseData: {
            activeUsers,
            remainingLicenses,
            tenantId,
            totalLicenses,
          },
        });

        await new LogController().writeLog({
          message: 'License history saved',
          type: 'INFO',
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

        if (fluigClient.httpStatus) {
          await new HttpResponseController().new({
            environmentId: item.id,
            responseTimeMs,
            endpoint: requestData.url,
            statusCode: fluigClient.httpStatus,
            timestamp: new Date().toISOString(),
          });
        }
      }
    } else {
      log.error(
        'syncEnvironmentsJob: Error while syncing environment',
        item.id,
        ':',
        fluigClient.errorStack,
        '(licenses api)'
      );
    }
  }
}

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
          timestamp: new Date().toISOString(),
          responseTimeMs,
          endpoint: requestData.url,
          monitorData,
        });

        await new LogController().writeLog({
          message: 'Monitor history saved',
          type: 'INFO',
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

        if (fluigClient.httpStatus) {
          await new HttpResponseController().new({
            environmentId: item.id,
            responseTimeMs,
            endpoint: requestData.url,
            statusCode: fluigClient.httpStatus,
            timestamp: new Date().toISOString(),
          });
        }
      }
    } else {
      log.error(
        'syncEnvironmentsJob: Error while syncing environment',
        item.id,
        ':',
        fluigClient.errorStack,
        '(monitor api)'
      );
    }
  }
}

export default async function syncEnvironmentsJob() {
  log.info('Executing environment sync job');

  const environmentList = await new EnvironmentController().getAll();

  if (environmentList.length > 0) {
    environmentList.forEach(async (item) => {
      log.info(
        'syncEnvironmentsJob: Checking related data for environment',
        item.id
      );
      let needsSync = false;

      const date = new Date();
      const hoursNow = `${date.getHours()}:${date.getMinutes()}`;
      const dayOfWeek = date.getDay();

      if (item.updateScheduleId) {
        if (
          hoursNow > item.updateScheduleId.from &&
          hoursNow < item.updateScheduleId.to
        ) {
          if (
            item.updateScheduleId.onlyOnWorkDays &&
            dayOfWeek >= 1 &&
            dayOfWeek <= 5
          ) {
            needsSync = true;
          } else if (!item.updateScheduleId.onlyOnWorkDays) {
            needsSync = true;
          }
        }

        const lastHttpResponse =
          await new EnvironmentController().getLastHttpResponseById(item.id);

        if (lastHttpResponse === null) {
          needsSync = true;
        } else if (
          Date.now() - lastHttpResponse.timestamp.getTime() >
          frequencyToMs(item.updateScheduleId.frequency)
        ) {
          needsSync = true;
        }

        if (needsSync) {
          log.info(
            'syncEnvironmentsJob: Environment',
            item.id,
            'needs synchronization. Fetching api data.'
          );
          await syncLicenseData(item);
          await syncMonitorData(item);
          // await syncStatisticsData(item); // TODO: Implement statistics sync

          log.info('syncEnvironmentsJob: Environment sync job finished');
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
}
