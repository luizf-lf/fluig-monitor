import log from 'electron-log';
import EnvironmentController from '../controllers/EnvironmentController';
import { environmentPingInterval } from '../utils/globalConstants';
import AuthKeysDecoder from '../../common/classes/AuthKeysDecoder';
import FluigAPIClient from '../../common/classes/FluigAPIClient';
import { EnvironmentWithRelatedData } from '../../common/interfaces/EnvironmentControllerInterface';
import HttpResponseController from '../controllers/HttpResponseController';
import frequencyToMs from '../utils/frequencyToMs';

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
 * Checks if the environments need a ping check
 */
export default async function pingEnvironmentsJob() {
  // log.info('pingEnvironmentsJob: Executing environment ping job');
  // log.info(
  //   `pingEnvironmentsJob: Next sync will occur at ${new Date(
  //     Date.now() + environmentPingInterval
  //   ).toLocaleString()}`
  // );

  const environmentList = await new EnvironmentController().getAll();

  if (environmentList.length > 0) {
    environmentList.forEach(async (environment) => {
      // log.info(
      //   `pingEnvironmentsJob: Checking related data for environment ${environment.id}`
      // );

      let needsPing = false;

      if (environment.updateScheduleId) {
        const lastHttpResponse =
          await new EnvironmentController().getLastHttpResponseById(
            environment.id
          );

        if (
          lastHttpResponse === null ||
          lastHttpResponse.statusCode < 200 ||
          lastHttpResponse.statusCode > 300
        ) {
          // log.info(
          //   `pingEnvironmentsJob: Environment ${environment.id} has no successful http requests. Ping is needed.`
          // );
          needsPing = true;
        } else if (
          Date.now() - lastHttpResponse.timestamp.getTime() >
          frequencyToMs(environment.updateScheduleId.pingFrequency)
        ) {
          // log.info(
          //   `pingEnvironmentsJob: Environment ${environment.id} has an old successful http response. Ping is needed.`
          // );
          needsPing = true;
        }

        if (needsPing) {
          // log.info(
          //   `pingEnvironmentsJob: Environment ${environment.id} needs pinging.`
          // );
          await executePing(environment);

          // log.info('pingEnvironmentsJob: Environment ping job finished.');
        } else {
          // log.info(
          //   `pingEnvironmentsJob: Environment ${environment.id} does not need pinging.`
          // );
        }
      } else {
        // log.warn(
        //   'pingEnvironmentsJob: No environment update schedule found, skipping pings.'
        // );
      }
    });
  } else {
    // log.info('pingEnvironmentsJob: No environment found, skipping pings.');
  }
}
