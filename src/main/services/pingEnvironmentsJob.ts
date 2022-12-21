/* eslint-disable prefer-destructuring */
import log from 'electron-log';
import { BrowserWindow, Notification } from 'electron';
import EnvironmentController from '../controllers/EnvironmentController';
// import { environmentPingInterval } from '../utils/globalConstants';
import AuthKeysDecoder from '../../common/classes/AuthKeysDecoder';
import FluigAPIClient from '../../common/classes/FluigAPIClient';
import { EnvironmentWithRelatedData } from '../../common/interfaces/EnvironmentControllerInterface';
import HttpResponseController from '../controllers/HttpResponseController';
import frequencyToMs from '../utils/frequencyToMs';
import HttpResponseResourceType from '../../common/interfaces/HttpResponseResourceTypes';

async function notifyAbout(
  environment: EnvironmentWithRelatedData
): Promise<void> {
  if (environment) {
    const responses = await new EnvironmentController().getHttpResponsesById(
      environment.id,
      10
    );

    let notification = null;
    const lastResponse = responses[0];
    let previousResponse = null;

    // TODO: Add translation to notifications

    if (lastResponse.responseTimeMs > 1000) {
      notification = new Notification({
        title: `${environment.name} com ping alto`,
        body: 'O servidor está com um tempo de resposta muito alto.',
      });
    }

    if (responses.length >= 2) {
      previousResponse = responses[1];

      if (
        lastResponse.responseTimeMs < 1000 &&
        previousResponse.responseTimeMs >= 1000
      ) {
        notification = new Notification({
          title: `${environment.name} operando normalmente`,
          body: 'O servidor voltou a operar dentro do tempo de resposta correto.',
        });
      }

      if (
        previousResponse.responseTimeMs === 0 &&
        lastResponse.responseTimeMs > 0
      ) {
        notification = new Notification({
          title: `${environment.name} disponível`,
          body: 'O servidor voltou a operar novamente.',
        });
      } else if (
        previousResponse.responseTimeMs > 0 &&
        lastResponse.responseTimeMs === 0
      ) {
        notification = new Notification({
          title: `${environment.name} está indisponível`,
          body: 'O servidor aparenta estar offline.',
        });
      }
    }

    if (notification) {
      notification.show();
    }
  }
}

/**
 * Executes a ping on the environment to check server availability
 */
async function executePing(
  environment: EnvironmentWithRelatedData
): Promise<void> {
  if (environment.oAuthKeysId) {
    const decodedKeys = new AuthKeysDecoder(environment.oAuthKeysId).decode();

    if (!decodedKeys) {
      log.error(
        'executePing: Could not decode the environment keys, ignoring ping.'
      );
      return;
    }

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
        log.warn(
          `executePing: Environment ${environment.id} returned a status code of ${fluigClient.httpStatus}`
        );
      }

      await new HttpResponseController().new(
        {
          environmentId: environment.id,
          responseTimeMs,
          endpoint: requestData.url,
          resourceType: HttpResponseResourceType.PING,
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
        resourceType: HttpResponseResourceType.PING,
        statusCode: 0,
        statusMessage: fluigClient.errorStack.split('\n')[0],
        timestamp: new Date().toISOString(),
      });
    }

    await notifyAbout(environment);

    // sends a signal to the renderer with the server status as an argument
    BrowserWindow.getAllWindows().forEach((windowElement) => {
      windowElement.webContents.send(`serverPinged_${environment.id}`, {
        serverIsOnline: !fluigClient.hasError && responseTimeMs > 0,
      });
    });
  }
}

/**
 * Checks if the environments need a ping check
 */
export default async function pingEnvironmentsJob() {
  const environmentList = await new EnvironmentController().getAll();

  if (environmentList.length > 0) {
    // for each environment, checks if there's a need for a ping
    environmentList.forEach(async (environment) => {
      let needsPing = false;

      if (environment.updateScheduleId) {
        const lastHttpResponse =
          await new EnvironmentController().getLastHttpResponseById(
            environment.id
          );

        // if there's no recently successfully http response
        if (
          lastHttpResponse === null ||
          lastHttpResponse.statusCode < 200 ||
          lastHttpResponse.statusCode > 300
        ) {
          needsPing = true;
        } else if (
          // if the last http response is older than the ping frequency threshold
          Date.now() - lastHttpResponse.timestamp.getTime() >
          frequencyToMs(environment.updateScheduleId.pingFrequency)
        ) {
          needsPing = true;
        }

        if (needsPing) {
          // executes the ping
          await executePing(environment);
        }
      } else {
        log.warn(
          `pingEnvironmentsJob: No environment update schedule found for environment${environment.id}, skipping ping.`
        );
      }
    });
  }
}
