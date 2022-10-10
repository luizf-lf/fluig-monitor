import axios from 'axios';
import log from 'electron-log';
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import EnvironmentController from '../controllers/EnvironmentController';
import AuthKeysDecoder from '../../common/classes/AuthKeysDecoder';

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
            const decodedKeys = new AuthKeysDecoder({
              hash: item.oAuthKeysId.hash,
              payload: item.oAuthKeysId.payload,
            }).decode();

            /**
             * @see https://www.npmjs.com/package/oauth-1.0a
             */
            const oauth = new OAuth({
              consumer: {
                key: decodedKeys.consumerKey,
                secret: decodedKeys.consumerSecret,
              },
              signature_method: 'HMAC-SHA1',
              hash_function(base_string, key) {
                return crypto
                  .createHmac('sha1', key)
                  .update(base_string)
                  .digest('base64');
              },
            });

            // oauth.authorize({
            //   url: `${item.baseUrl}/license/api/v1/licenses`,
            //   method: 'GET',
            // });

            // TODO: finish implementation
            const licensesData = await axios.get(
              `${item.baseUrl}/license/api/v1/licenses`,
              {
                headers: {
                  Authorization: oauth.toHeader(
                    oauth.authorize(
                      {
                        url: `${item.baseUrl}/license/api/v1/licenses`,
                        method: 'GET',
                      },
                      {
                        key: decodedKeys.accessToken,
                        secret: decodedKeys.tokenSecret,
                      }
                    )
                  ),
                },
              }
            );

            //
          }
        }
      }
    });
  } else {
    log.info('No environment found, skipping sync.');
  }
}
