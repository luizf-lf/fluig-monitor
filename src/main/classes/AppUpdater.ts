/* eslint-disable prefer-destructuring */
import path from 'path';
import fs from 'fs';
import log from 'electron-log';
import axios from 'axios';
import { exec } from 'child_process';
import crypto from 'crypto';
import { app, BrowserWindow, dialog } from 'electron';
import GitHubReleaseInterface, {
  ReleaseAsset,
} from '../interfaces/GitHubReleaseInterface';
import { version as appVersion } from '../../../package.json';
import getAppDataFolder from '../utils/fsUtils';
import formatBytes from '../../common/utils/formatBytes';
import byteSpeed from '../../common/utils/byteSpeed';
import i18n from '../../common/i18n/i18n';
import SettingsController from '../controllers/SettingsController';
import { isDevelopment } from '../../main/utils/globalConstants';

export interface AppUpdaterConstructorOptions {
  forceOptions: { forceDownload?: boolean; forceInstall?: boolean };
}

/**
 * The app updater class.
 * It should check the latest available release from the GitHub releases page and download the latest release according
 *  to the current os if available. It can also check the SHA256 file signature before executing the installer.
 * @since 0.4.0
 */
export default class AppUpdater {
  /**
   * The releases endpoint. Defaults to 'https://api.github.com/repos/luizf-lf/fluig-monitor/releases'
   */
  releasesEndpoint: string;

  /**
   * The updates folder path. Defaults to %appdata%/fluig-monitor/updates
   */
  updatesPath: string;

  /**
   * A string representing the current app version. Eg.: 0.3.0
   */
  currentVersion: string;

  /**
   * The version regex to normalize the version string
   */
  versionRgx: RegExp;

  /**
   * An array of objects representing all of the releases from the GitHub page.
   */
  releases: GitHubReleaseInterface[];

  /**
   * A object representing the latest app release from the github pages
   */
  latestRelease: GitHubReleaseInterface | undefined;

  /**
   * A object representing the current app release from the github pages
   */
  currentRelease: GitHubReleaseInterface | undefined;

  /**
   * A object representing the release asset for Windows
   */
  win32ReleaseAsset: ReleaseAsset | undefined;

  /**
   * A string representing the full path to the downloaded Windows updater executable.
   */
  win32FilePath: string | undefined;

  /**
   * If the app update file should be automatically downloaded
   */
  shouldAutoDownload: boolean;

  /**
   * If the app should auto update itself
   */
  shouldAutoInstall: boolean;

  /**
   * The time to evaluate actions timeout
   */
  actionsTimeout: number;

  /**
   * If the update download will be forced (Override the db setting)
   */
  forceDownload: boolean;

  /**
   * If the update file execution will be forced (Override database settings)
   */
  forceInstall: boolean;

  /**
   * The class constructor. Sets the properties to it's default values.
   * @since 0.4.0
   */
  constructor(options?: AppUpdaterConstructorOptions) {
    this.releasesEndpoint =
      'https://api.github.com/repos/luizf-lf/fluig-monitor/releases';
    this.updatesPath = path.resolve(getAppDataFolder(), 'updates');
    this.versionRgx = /([A-Z])+/gi;
    this.currentVersion = appVersion.replace(this.versionRgx, '');
    this.releases = [];
    this.latestRelease = undefined;
    this.win32ReleaseAsset = undefined;
    this.win32FilePath = '';
    this.shouldAutoDownload = false;
    this.shouldAutoInstall = false;
    this.actionsTimeout = 4000;
    this.forceDownload = false;
    this.forceInstall = false;
    if (options && options.forceOptions.forceDownload) {
      this.forceDownload = true;
    }
    if (options && options.forceOptions.forceInstall) {
      this.forceInstall = true;
    }
  }

  /**
   * Executes the updater file.
   * @param execPath the executable file path
   * @since 0.4.0
   */
  executeUpdater(execPath: string): void {
    if (this.shouldAutoInstall) {
      exec(execPath).on('spawn', () => {
        log.info('AppUpdater: App will auto quit and update itself');
        setTimeout(() => {
          app.quit();
        }, this.actionsTimeout);
      });

      return;
    }

    // sends a notification about the downloaded update
    setTimeout(() => {
      BrowserWindow.getAllWindows().forEach((windowElement) => {
        windowElement.webContents.send('appUpdateStatusChange', {
          status: 'DOWNLOADED',
        });
      });
    }, this.actionsTimeout);

    // adds a 5 seconds timeout to make sure the current language is loaded before the dialog is shown
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
              log.info('AppUpdater: App will quit and update itself');
              setTimeout(() => {
                app.quit();
              }, this.actionsTimeout);
            });

            return null;
          }

          log.info("User don't like updates :{");
          return null;
        })
        .catch((error) => {
          log.error(`showUpdateDialog: Unknown error: ${error}`);
        });
    }, this.actionsTimeout);
  }

  /**
   * Checks for app updates and download the latest release from the official GitHub repository.
   *  Serves as an entry point to the class do it's magic.
   * @since 0.4.0
   */
  async checkUpdates(): Promise<void> {
    try {
      if (isDevelopment) {
        log.info('AppUpdate: App is running in dev mode. Ignoring updates.');
        return;
      }

      log.info('AppUpdater: Checking for app updates.');

      // recovers the app settings related to updates
      const { ENABLE_AUTO_DOWNLOAD_UPDATE, ENABLE_AUTO_INSTALL_UPDATE } =
        await new SettingsController().getAllAsObject();
      if (ENABLE_AUTO_DOWNLOAD_UPDATE) {
        this.shouldAutoDownload = ENABLE_AUTO_DOWNLOAD_UPDATE.value === 'true';
      }
      if (ENABLE_AUTO_INSTALL_UPDATE) {
        this.shouldAutoInstall = ENABLE_AUTO_INSTALL_UPDATE.value === 'true';
      }

      if (this.forceDownload) {
        log.info(`AppUpdater: shouldAutoDownload option has been overwritten`);
        this.shouldAutoDownload = true;
      }

      if (this.forceInstall) {
        log.info(`AppUpdater: shouldAutoInstall option has been overwritten`);
        this.shouldAutoInstall = true;
      }

      if (!fs.existsSync(this.updatesPath)) {
        fs.mkdirSync(this.updatesPath);
        log.info(
          `AppUpdater: Updates folder has been created at ${this.updatesPath}`
        );
      }

      const response = await axios.get(this.releasesEndpoint);

      // checks if the response is successful
      if (response.status !== 200) {
        log.warn(
          `AppUpdater: An error occurred while fetching the latest app update (HTTP ${response.status}: ${response.statusText})`
        );
        return;
      }

      this.releases = response.data;
      this.latestRelease = this.releases[0];
      this.currentRelease = this.releases.find(
        (item) =>
          item.tag_name.replace(this.versionRgx, '') === this.currentVersion
      );

      // checks if the current app version has been found in the releases array
      if (typeof this.currentRelease === 'undefined') {
        log.warn(
          'AppUpdater: Could not determine app version from the releases page. This may happen when the current version is a pre-release or an unofficial release.'
        );
        return;
      }

      this.win32ReleaseAsset = this.latestRelease.assets.find(
        (asset) => asset.name.indexOf('.exe') > 0
      );
      this.win32FilePath = this.win32ReleaseAsset
        ? path.resolve(this.updatesPath, this.win32ReleaseAsset.name)
        : undefined;

      if (this.currentRelease.tag_name === this.latestRelease.tag_name) {
        log.info('App is already up to date');

        if (process.platform === 'win32' && this.win32FilePath !== undefined) {
          if (fs.existsSync(this.win32FilePath)) {
            fs.rmSync(this.win32FilePath);
            log.info(`File ${this.win32FilePath} has been deleted.`);
          }
        }

        return;
      }

      if (
        new Date(this.latestRelease.published_at).getTime() >
        new Date(this.currentRelease.published_at).getTime()
      ) {
        log.info(
          `AppUpdater: A new app version is available (${this.latestRelease.tag_name})`
        );

        if (
          process.platform === 'win32' &&
          this.win32ReleaseAsset !== undefined &&
          this.win32FilePath !== undefined
        ) {
          const fileSize = formatBytes(this.win32ReleaseAsset.size);

          if (
            fs
              .readdirSync(this.updatesPath)
              .find(
                (fileName) =>
                  this.win32ReleaseAsset &&
                  fileName === this.win32ReleaseAsset.name
              )
          ) {
            log.info('AppUpdater: Update file has already been downloaded.');

            this.executeUpdater(this.win32FilePath);
            return;
          }

          if (this.shouldAutoDownload) {
            log.info(
              `AppUpdater: Downloading the latest release for Windows (${this.win32ReleaseAsset.name}) (${fileSize})`
            );
            const timer = Date.now();
            const streamRes = await axios.get(
              this.win32ReleaseAsset.browser_download_url,
              {
                responseType: 'stream',
              }
            );

            if (streamRes.status !== 200) {
              log.warn(
                `AppUpdater: Could not download the latest release file (HTTP ${streamRes.status}: ${streamRes.statusText}`
              );
              return;
            }

            const fileStream = fs.createWriteStream(this.win32FilePath);
            streamRes.data.pipe(fileStream);

            fileStream.on('finish', async () => {
              try {
                if (
                  this.win32ReleaseAsset &&
                  this.latestRelease &&
                  this.win32FilePath
                ) {
                  log.info(
                    `AppUpdater: Downloaded ${fileSize} in ${
                      Date.now() - timer
                    }ms @ ${byteSpeed(
                      this.win32ReleaseAsset.size,
                      Date.now() - timer
                    )}`
                  );
                  let checkHash = false;

                  // Checks the file hash from the description
                  const description = this.latestRelease.body.split('\r\n');
                  const win32ReleaseIndexInDescription = description.findIndex(
                    (line: string) =>
                      this.win32ReleaseAsset &&
                      line
                        .replace(' ', '.')
                        .indexOf(this.win32ReleaseAsset.name) > 0
                  );
                  const win32FileSHA256IndexInDescription =
                    description.findIndex(
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
                      'AppUpdater: File hash not found on the release description, skipping check.'
                    );
                  }

                  if (checkHash) {
                    if (process.platform === 'win32') {
                      log.info('AppUpdater: Checking file hash for win32');
                      const win32OriginHash =
                        description[win32FileSHA256IndexInDescription].split(
                          ': '
                        )[1];

                      const fileData = fs.readFileSync(this.win32FilePath);

                      // using crypto instead of forge, since it's faster and can read the original file buffer
                      const localFileHash = crypto
                        .createHash('sha256')
                        .update(fileData)
                        .digest('hex');

                      if (localFileHash === win32OriginHash) {
                        log.info('AppUpdater: Hashes match');
                        this.executeUpdater(this.win32FilePath);
                      } else {
                        log.warn(
                          'AppUpdater: Hashes does not match. Installer has been deleted and will not be executed.'
                        );
                        fs.rmSync(this.win32FilePath);
                      }
                    }
                  } else {
                    log.warn(
                      'AppUpdater: Executing updater without hash verification.'
                    );
                    this.executeUpdater(this.win32FilePath);
                  }
                }
              } catch (error) {
                log.error(
                  `AppUpdater: An error ocurred while saving update file: ${error}`
                );
              }
            });
          } else {
            // sends a notification about the available update
            setTimeout(() => {
              BrowserWindow.getAllWindows().forEach((windowElement) => {
                windowElement.webContents.send('appUpdateStatusChange', {
                  status: 'AVAILABLE',
                });
              });
            }, this.actionsTimeout);
          }
        } else {
          log.info(
            "AppUpdater: Curiously, there's no release available for the current OS. You can only ponder."
          );
        }
      }
    } catch (error) {
      log.error(`AppUpdater: An unknown error occurred: ${error}`);
    }
  }
}
