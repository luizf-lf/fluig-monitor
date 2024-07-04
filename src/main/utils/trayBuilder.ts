import { app, Menu, shell, Tray } from 'electron';
import log from 'electron-log';
import path from 'path';

import i18n from '../../common/i18n/i18n';
import getAssetPath from './getAssetPath';
import { version } from '../../../package.json';
import GAEvents from '../analytics/GAEvents';

export default function trayBuilder(
  instance: Tray | null,
  reopenFunction: () => void
): Tray {
  if (instance !== null) instance.destroy();

  const newInstance = new Tray(path.join(getAssetPath(), 'icon.ico'));
  newInstance.setToolTip(i18n.t('menu.systemTray.running'));
  newInstance.on('click', reopenFunction);
  newInstance.setContextMenu(
    Menu.buildFromTemplate([
      {
        type: 'normal',
        label: `Fluig Monitor - v${version}`,
        enabled: false,
      },
      { type: 'separator' },
      {
        type: 'normal',
        label: i18n.t('menu.systemTray.open'),
        click: reopenFunction,
      },
      {
        type: 'normal',
        label: i18n.t('menu.systemTray.reportABug'),
        click: () =>
          shell.openExternal(
            'https://github.com/luizf-lf/fluig-monitor/issues/new/choose'
          ),
      },
      {
        type: 'normal',
        label: i18n.t('menu.systemTray.dropBombs'),
        enabled: false,
      },
      {
        type: 'normal',
        label: i18n.t('menu.systemTray.quit'),
        click: () => {
          GAEvents.appClosed('System Tray');

          log.info(
            'App will be closed since the system tray option has been clicked.'
          );
          setTimeout(() => {
            app.quit();
          }, 500);
        },
      },
    ])
  );

  return newInstance;
}
