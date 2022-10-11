/* eslint-disable @typescript-eslint/no-explicit-any */
import log from 'electron-log';
import EnvironmentController from '../controllers/EnvironmentController';
import AuthKeysDecoder from '../../common/classes/AuthKeysDecoder';
import FluigAPIClient from '../../common/classes/FluigAPIClient';

export default async function syncEnvironmentsJob() {
  log.info('Executing environment sync job');

  const environmentList = await new EnvironmentController().getAll();

  if (environmentList.length > 0) {
    environmentList.forEach(async (item) => {
      log.info('Checking related data for environment', item.id);
      const environmentHistory =
        await new EnvironmentController().getHistoryById(item.id);

      if (environmentHistory) {
        log.info(environmentHistory);
        let needsSync = false;

        if (environmentHistory.statisticHistory.length === 0) {
          needsSync = true;
        }

        if (needsSync) {
          log.info('Fetching monitor data for environment', item.id);

          if (item.oAuthKeysId) {
            // ===== Begin Fluig API Client =====

            const decodedKeys = new AuthKeysDecoder({
              hash: item.oAuthKeysId.hash,
              payload: item.oAuthKeysId.payload,
            }).decode();

            const requestData = {
              url: `${item.baseUrl}/license/api/v1/licenses`,
              method: 'GET',
            };

            // const token = {
            //   key: decodedKeys.accessToken,
            //   secret: decodedKeys.tokenSecret,
            // };

            // /**
            //  * @see https://www.npmjs.com/package/oauth-1.0a
            //  */
            // const oauth = new OAuth({
            //   consumer: {
            //     key: decodedKeys.consumerKey,
            //     secret: decodedKeys.consumerSecret,
            //   },
            //   signature_method: 'HMAC-SHA1',
            //   hash_function(base_string, key) {
            //     return crypto
            //       .createHmac('sha1', key)
            //       .update(base_string)
            //       .digest('base64');
            //   },
            // });

            // ===== End Fluig API Client =====

            // try {
            //   const licensesData = await axios.get(requestData.url, {
            //     headers: {
            //       ...oauth.toHeader(oauth.authorize(requestData, token)),
            //     },
            //   });

            //   log.info('Fluig API Response: ');
            //   log.info(licensesData.data);
            // } catch (e: any) {
            //   log.error(e.stack);
            // }

            const fluigClient = new FluigAPIClient({
              oAuthKeys: decodedKeys,
              requestData,
            });

            await fluigClient.get();

            if (!fluigClient.hasError) {
              if (fluigClient.httpStatus === 200) {
                log.info('fluigClient.httpResponse:');
                log.info(fluigClient.httpResponse);
              } else {
                log.warn(
                  'Server error while fetching data from environment',
                  item.id,
                  `(${fluigClient.httpStatus})`
                );
              }
            } else {
              log.error(
                'Error while syncing environment',
                item.id,
                ':',
                fluigClient.errorStack
              );
            }
          }
        }
      }
    });
  } else {
    log.info('No environment found, skipping sync.');
  }
}
