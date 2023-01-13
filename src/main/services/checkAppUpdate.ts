import path from 'path';
import fs, { createWriteStream } from 'fs';
import log from 'electron-log';
import axios from 'axios';
import { exec } from 'child_process';
import { app } from 'electron';
import GitHubReleaseInterface from '../interfaces/GitHubReleaseInterface';
import { version as appVersion } from '../../../package.json';
import getAppDataFolder from '../utils/fsUtils';
import formatBytes from '../../common/utils/formatBytes';
import byteSpeed from '../../common/utils/byteSpeed';

export default async function checkAppUpdate() {
  try {
    log.info('App Updater: Checking for app updates.');
    const updatesPath = path.resolve(getAppDataFolder(), 'updates');

    if (!fs.existsSync(updatesPath)) {
      fs.mkdirSync(updatesPath);
      log.info(
        `App Updater: Updates folder has been created at ${updatesPath}`
      );
    }

    const response = await axios.get(
      'https://api.github.com/repos/luizf-lf/fluig-monitor/releases'
    );
    const rgx = /([A-Z])+/gi;

    // checks if the response is successful
    if (response.status !== 200) {
      log.warn(
        `App Updater: An error occurred while fetching the latest app update (HTTP ${response.status}: ${response.statusText})`
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
        'App Updater: Could not determine app version from the releases page. This may happen when the current version is a pre-release or an unofficial release.'
      );
      return;
    }

    if (
      new Date(latestRelease.published_at).getTime() >
      new Date(currentRelease.published_at).getTime()
    ) {
      // has a new version
      log.info(
        `App Updater: A new app version is available (${latestRelease.tag_name})`
      );

      const windowsReleaseAsset = latestRelease.assets.find(
        (asset) => asset.name.indexOf('.exe') > 0
      );

      if (
        process.platform === 'win32' &&
        typeof windowsReleaseAsset === 'object'
      ) {
        const fileSize = formatBytes(windowsReleaseAsset.size);

        if (
          fs
            .readdirSync(updatesPath)
            .find((fileName) => fileName === windowsReleaseAsset.name)
        ) {
          log.info('App Updater: Update file has already been downloaded.');
          return;
        }

        log.info(
          `App Updater: Downloading the latest release for Windows (${windowsReleaseAsset.name}) (${fileSize})`
        );
        const timer = Date.now();
        const streamRes = await axios.get(
          windowsReleaseAsset.browser_download_url,
          {
            responseType: 'stream',
          }
        );

        if (streamRes.status !== 200) {
          log.warn(
            `App Updater: Could not download the latest release file (HTTP ${streamRes.status}: ${streamRes.statusText}`
          );
          return;
        }

        const fileStream = createWriteStream(
          path.resolve(updatesPath, windowsReleaseAsset.name)
        );
        streamRes.data.pipe(fileStream);

        fileStream.on('finish', () => {
          log.info(
            `App Updater: Downloaded ${fileSize} in ${
              Date.now() - timer
            }ms @ ${byteSpeed(windowsReleaseAsset.size, Date.now() - timer)}`
          );

          // TODO: Check file hash if possible

          // executes the updater
          exec(path.resolve(updatesPath, windowsReleaseAsset.name)).on(
            'spawn',
            () => {
              log.info('App Updater: App will quit and update itself');
              setTimeout(() => {
                app.quit();
              }, 2500);
            }
          );
        });
      }

      // TODO: Notify about the latest release
      // TODO: Implement auto-update settings
    }
  } catch (error) {
    log.error(
      'App Updater: An unknown error occurred while checking for app updates:'
    );
    log.error(error);
  }
}
