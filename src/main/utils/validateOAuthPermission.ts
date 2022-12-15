/* eslint-disable no-await-in-loop */
import log from 'electron-log';
import FluigAPIClient from '../../common/classes/FluigAPIClient';

export interface AuthObject {
  consumerKey: string;
  consumerSecret: string;
  accessToken: string;
  tokenSecret: string;
}

/**
 * Validates if the oAuth user has the necessary permissions to collect data from the Fluig server
 * @since 0.2.2
 */
export default async function validateOAuthPermission(
  auth: AuthObject,
  domainUrl: string
) {
  const results = [];

  try {
    if (!auth || !domainUrl) {
      throw new Error('Required parameters were not provided');
    }

    log.info(`validateOAuthPermission: Validating oAuth user permissions`);
    const endpoints = [
      '/api/servlet/ping',
      '/monitoring/api/v1/statistics/report',
      '/monitoring/api/v1/monitors/report',
      '/license/api/v1/licenses',
    ];

    let fluigClient = null;

    for (let i = 0; i < endpoints.length; i += 1) {
      const endpoint = endpoints[i];

      fluigClient = new FluigAPIClient({
        oAuthKeys: auth,
        requestData: {
          method: 'GET',
          url: domainUrl + endpoint,
        },
      });

      await fluigClient.get();

      if (fluigClient.httpStatus === 200) {
        log.info('validateOAuthPermission: Permission is valid');
      } else if (
        fluigClient.httpStatus === 401 ||
        fluigClient.httpStatus === 403
      ) {
        log.warn('validateOAuthPermission: Permission is invalid');
      } else {
        log.error(
          `validateOAuthPermission: An error occurred while checking permission: ${fluigClient.errorStack}`
        );
      }

      results.push({
        endpoint,
        httpStatus: fluigClient.httpStatus,
      });
    }
  } catch (error) {
    log.error(`validateOAuthPermission: An error occurred: ${error}`);
  }

  return results;
}
