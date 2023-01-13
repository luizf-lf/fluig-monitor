import path from 'path';
import log from 'electron-log';
import axios from 'axios';
import { createWriteStream } from 'fs';
import GitHubReleaseInterface from '../interfaces/GitHubReleaseInterface';
import { version as appVersion } from '../../../package.json';
import getAppDataFolder from '../utils/fsUtils';
import formatBytes from '../../common/utils/formatBytes';

export default async function checkAppUpdate() {
  try {
    log.info('Checking for app updates.');
    const response = await axios.get(
      'https://api.github.com/repos/luizf-lf/fluig-monitor/releases'
    );
    const rgx = /([A-Z])+/gi;

    // checks if the response is successful
    if (response.status !== 200) {
      log.warn(
        `An error occurred while fetching the latest app update (HTTP ${response.status}: ${response.statusText})`
      );
      return;
    }

    const currentVersion = '0.2.0';
    // const currentVersion = appVersion.replace(rgx, '');
    const releases = response.data as GitHubReleaseInterface[];
    const latestRelease = releases[0];
    const currentRelease = releases.find(
      (item) => item.tag_name.replace(rgx, '') === currentVersion
    );

    // checks if the current app version has been found on the releases array
    if (typeof currentRelease === 'undefined') {
      log.warn(
        'Could not determine app version from the releases page. This may happen when the current version is a pre-release or an unofficial release.'
      );
      return;
    }

    if (
      new Date(latestRelease.published_at).getTime() >
      new Date(currentRelease.published_at).getTime()
    ) {
      // has a new version
      log.info(`A new app version is available (${latestRelease.tag_name})`);

      const windowsReleaseAsset = latestRelease.assets.find(
        (asset) => asset.name.indexOf('.exe') > 0
      );

      if (
        process.platform === 'win32' &&
        typeof windowsReleaseAsset === 'object'
      ) {
        const fileSize = formatBytes(windowsReleaseAsset.size);
        log.info(
          `Downloading the latest release for Windows (${windowsReleaseAsset.name}) (${fileSize})`
        );
        const timer = Date.now();
        const streamRes = await axios.get(
          windowsReleaseAsset.browser_download_url,
          {
            responseType: 'stream',
          }
        );

        if (streamRes.status !== 200) {
          log.warn('Could not download the latest release file.');
          return;
        }

        const fileStream = createWriteStream(
          path.resolve(getAppDataFolder(), windowsReleaseAsset.name)
        );
        streamRes.data.pipe(fileStream);

        fileStream.on('finish', () => {
          log.info(
            `Downloaded ${fileSize} in ${Date.now() - timer}ms @ ${formatBytes(
              windowsReleaseAsset.size / ((Date.now() - timer) / 1000)
            )}/s`
          );
        });
      }

      // TODO: Notify about the latest release
      // TODO: Implement auto-update settings
    }
  } catch (error) {
    log.error('An unknown error occurred while checking for app updates:');
    log.error(error);
  }
}
