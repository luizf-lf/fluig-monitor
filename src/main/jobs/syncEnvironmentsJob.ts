/* eslint-disable @typescript-eslint/no-explicit-any */
import log from 'electron-log';
import EnvironmentController from '../controllers/EnvironmentController';
import AuthKeysDecoder from '../../common/classes/AuthKeysDecoder';
import FluigAPIClient from '../../common/classes/FluigAPIClient';
import LicenseHistoryController from '../controllers/LicenseHistoryController';
import LogController from '../controllers/LogController';
import { EnvironmentWithRelatedData } from '../../common/interfaces/EnvironmentControllerInterface';
import HttpResponseController from '../controllers/HttpResponseController';

async function syncLicenseData(item: EnvironmentWithRelatedData) {
  log.info('Fetching license data');
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
          'syncEnvironmentsJob: Server error while fetching data from environment',
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
        fluigClient.errorStack
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

        // const environmentHistory =
        //   await new EnvironmentController().getHistoryById(item.id);

        // if (environmentHistory) {

        //   if (environmentHistory.statisticHistory.length === 0) {
        //     needsSync = true;
        //   }
        // }

        if (needsSync) {
          log.info(
            'syncEnvironmentsJob: Environment',
            item.id,
            'needs synchronization. Fetching monitor api data'
          );
          await syncLicenseData(item);
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

  log.info('Environment sync job finished');
}
