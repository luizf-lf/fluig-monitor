import log from 'electron-log';
import frequencyToMs from '../utils/frequencyToMs';
import EnvironmentController from '../controllers/EnvironmentController';
import { EnvironmentWithRelatedData } from '../../common/interfaces/EnvironmentControllerInterface';
import AuthKeysDecoder from '../../common/classes/AuthKeysDecoder';
import FluigAPIClient from '../../common/classes/FluigAPIClient';
import HttpResponseController from '../controllers/HttpResponseController';

/**
 * Executes a ping on the environment to check server availability
 */
async function executePing(
  environment: EnvironmentWithRelatedData
): Promise<void> {
  if (environment.oAuthKeysId) {
    const decodedKeys = new AuthKeysDecoder({
      hash: environment.oAuthKeysId.hash,
      payload: environment.oAuthKeysId.payload,
    }).decode();

    const requestData = {
      url: `${environment.baseUrl}/api/servlet/ping`,
      method: 'GET',
    };

    const fluigClient = new FluigAPIClient({
      oAuthKeys: decodedKeys,
      requestData,
    });

    const initialTiming = Date.now();

    await fluigClient.get(true);

    const responseTimeMs = Date.now() - initialTiming;

    if (!fluigClient.hasError) {
      if (
        fluigClient.httpStatus &&
        fluigClient.httpStatus < 200 &&
        fluigClient.httpStatus >= 300
      ) {
        log.info(
          `executePing: Environment ${environment.id} returned a status code of ${fluigClient.httpStatus}`
        );
      }

      await new HttpResponseController().new(
        {
          environmentId: environment.id,
          responseTimeMs,
          endpoint: requestData.url,
          statusCode: fluigClient.httpStatus || 0,
          statusMessage: fluigClient.httpStatusText,
          timestamp: new Date().toISOString(),
        },
        true
      );
    } else {
      log.error(
        `executePing: Error on environment ${environment.id}: ${
          fluigClient.errorStack.split('\n')[0]
        }`
      );

      await new HttpResponseController().new({
        environmentId: environment.id,
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
 * Dispatches all of the environment ping "jobs" according to the respective environment ping schedule
 */
export default async function dispatchEnvironmentPingJobs() {
  log.info('dispatchEnvironmentPingJobs: Executing environment ping job');

  const environmentList = await new EnvironmentController().getAll();

  if (environmentList.length > 0) {
    for (let i = 0; i < environmentList.length; i += 1) {
      const environmentItem = environmentList[i];

      if (environmentItem.updateScheduleId) {
        log.info(
          `dispatchEnvironmentPingJobs: Dispatching ping job for environment "${environmentItem.name}" every ${environmentItem.updateScheduleId.pingFrequency}`
        );
        setInterval(async () => {
          await executePing(environmentItem);
        }, frequencyToMs(environmentItem.updateScheduleId.pingFrequency));
      }
    }
  }
}