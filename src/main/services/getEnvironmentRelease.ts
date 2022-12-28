import log from 'electron-log';
import AuthObject from '../../common/interfaces/AuthObject';
import FluigAPIClient from '../../common/classes/FluigAPIClient';

export interface V2VersionApiResponse {
  content: string;
  message: string | null;
}

export default async function getEnvironmentRelease(
  auth: AuthObject,
  domainUrl: string
): Promise<V2VersionApiResponse | null> {
  try {
    if (!auth || !domainUrl) {
      throw new Error('Required parameters were not provided');
    }

    const endpoint = '/api/public/wcm/version/v2';
    log.info(
      `getEnvironmentRelease: Recovering environment release from ${domainUrl}${endpoint}`
    );

    let version = null;

    const fluigClient = new FluigAPIClient({
      oAuthKeys: auth,
      requestData: {
        method: 'GET',
        url: domainUrl + endpoint,
      },
    });

    await fluigClient.get();

    if (fluigClient.httpStatus === 200) {
      version = fluigClient.httpResponse;
    } else {
      log.error(
        `getEnvironmentRelease: An error occurred while checking permission: ${fluigClient.errorStack}`
      );
    }

    return version;
  } catch (error) {
    log.error(`getEnvironmentRelease: An error occurred: ${error}`);
    return null;
  }
}
