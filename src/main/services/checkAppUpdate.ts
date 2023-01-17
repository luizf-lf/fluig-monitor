import path from 'path';
import fs from 'fs';
import log from 'electron-log';
import axios from 'axios';
import { exec } from 'child_process';
import crypto from 'crypto';
import { app, BrowserWindow, dialog } from 'electron';
import GitHubReleaseInterface from '../interfaces/GitHubReleaseInterface';
import { version as appVersion } from '../../../package.json';
import getAppDataFolder from '../utils/fsUtils';
import formatBytes from '../../common/utils/formatBytes';
import byteSpeed from '../../common/utils/byteSpeed';
import i18n from '../../common/i18n/i18n';

// TODO: Turn into a class and rename to AppUpdater
/**
 * Shows the updates available dialog and executes the installer file
 * @param execPath the executable file path
 * @since 0.4.0
 */
function showUpdateDialog(execPath: string): void {
  // adds a 10 seconds timeout to make sure the current language is loaded before the dialog is shown
  //  (in case the file has already been downloaded)
  setTimeout(() => {
    dialog
      .showMessageBox(BrowserWindow.getAllWindows()[0], {
        title: i18n.t('dialogs.updateDialog.title'),
        message: i18n.t('dialogs.updateDialog.message'),
        detail: i18n.t('dialogs.updateDialog.detail'),
        buttons: [
          i18n.t('dialogs.updateDialog.btnYes'),
          i18n.t('dialogs.updateDialog.btnNo'),
        ],
        cancelId: 1,
      })
      .then((clicked) => {
        if (clicked.response === 0) {
          exec(execPath).on('spawn', () => {
            log.info('App Updater: App will quit and update itself');
            setTimeout(() => {
              app.quit();
            }, 5000);
          });

          return null;
        }

        log.info("User don't like updates :{");
        return null;
      })
      .catch((error) => {
        log.error(`showUpdateDialog: Unknown error: ${error}`);
      });
  }, 10000);
}

/**
 * Checks for app updates and download the latest release from the official GitHub repository.
 * @since 0.4.0
 */
export default async function checkAppUpdate(): Promise<void> {
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

    const currentVersion = appVersion.replace(rgx, '');
    const releases = response.data as GitHubReleaseInterface[];
    const latestRelease = releases[0];
    const currentRelease = releases.find(
      (item) => item.tag_name.replace(rgx, '') === currentVersion
    );

    // checks if the current app version has been found in the releases array
    if (typeof currentRelease === 'undefined') {
      log.warn(
        'App Updater: Could not determine app version from the releases page. This may happen when the current version is a pre-release or an unofficial release.'
      );
      return;
    }

    const win32ReleaseAsset = latestRelease.assets.find(
      (asset) => asset.name.indexOf('.exe') > 0
    );
    const win32FilePath = win32ReleaseAsset
      ? path.resolve(updatesPath, win32ReleaseAsset.name)
      : null;

    if (currentRelease.tag_name === latestRelease.tag_name) {
      log.info('App is already up to date');

      if (process.platform === 'win32' && win32FilePath !== null) {
        if (fs.existsSync(win32FilePath)) {
          fs.rmSync(win32FilePath);
          log.info(`File ${win32FilePath} has been deleted.`);
        }
      }

      return;
    }

    if (
      new Date(latestRelease.published_at).getTime() >
      new Date(currentRelease.published_at).getTime()
    ) {
      log.info(
        `App Updater: A new app version is available (${latestRelease.tag_name})`
      );

      if (
        process.platform === 'win32' &&
        typeof win32ReleaseAsset === 'object' &&
        win32FilePath !== null
      ) {
        const fileSize = formatBytes(win32ReleaseAsset.size);

        if (
          fs
            .readdirSync(updatesPath)
            .find((fileName) => fileName === win32ReleaseAsset.name)
        ) {
          log.info('App Updater: Update file has already been downloaded.');

          showUpdateDialog(win32FilePath);
          return;
        }

        log.info(
          `App Updater: Downloading the latest release for Windows (${win32ReleaseAsset.name}) (${fileSize})`
        );
        const timer = Date.now();
        const streamRes = await axios.get(
          win32ReleaseAsset.browser_download_url,
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

        const fileStream = fs.createWriteStream(win32FilePath);
        streamRes.data.pipe(fileStream);

        fileStream.on('finish', async () => {
          try {
            log.info(
              `App Updater: Downloaded ${fileSize} in ${
                Date.now() - timer
              }ms @ ${byteSpeed(win32ReleaseAsset.size, Date.now() - timer)}`
            );
            let checkHash = false;

            // Checks the file hash from the description
            const description = latestRelease.body.split('\r\n');
            const win32ReleaseIndexInDescription = description.findIndex(
              (line: string) =>
                line.replace(' ', '.').indexOf(win32ReleaseAsset.name) > 0
            );
            const win32FileSHA256IndexInDescription = description.findIndex(
              (line: string, idx: number) =>
                line.indexOf('SHA256: ') === 0 &&
                idx > win32ReleaseIndexInDescription
            );

            if (
              win32ReleaseIndexInDescription > -1 &&
              win32FileSHA256IndexInDescription > -1
            ) {
              checkHash = true;
            } else {
              log.info(
                'File hash not found on the release description, skipping check.'
              );
            }

            if (checkHash) {
              if (process.platform === 'win32') {
                log.info('Checking file hash for win32');
                const win32OriginHash =
                  description[win32FileSHA256IndexInDescription].split(': ')[1];

                const fileData = fs.readFileSync(win32FilePath);

                // using crypto instead of forge, since it's faster and can read the original file buffer
                const localFileHash = crypto
                  .createHash('sha256')
                  .update(fileData)
                  .digest('hex');

                if (localFileHash === win32OriginHash) {
                  log.info('Hashes match');
                  showUpdateDialog(win32FilePath);
                } else {
                  log.warn(
                    'Hashes does not match. Installer has been deleted and will not be executed.'
                  );
                  fs.rmSync(win32FilePath);
                }
              }
            } else {
              log.warn('Executing updater without hash verification.');
              showUpdateDialog(win32FilePath);
            }
          } catch (error) {
            log.error(`An error ocurred while saving update file: ${error}`);
          }
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
