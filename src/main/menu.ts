import {
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
  app,
} from 'electron';
import { t } from 'i18next';
import i18n from '../common/i18n/i18n';

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  // enables the 'inspect element' option when a item is right-clicked
  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    };
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    };

    const subMenuEdit: MenuItemConstructorOptions = {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }],
        },
      ],
    };

    const subMenuHelp: MenuItemConstructorOptions = {
      label: t('menu.about.label'),
      submenu: [
        {
          label: 'Github',
          click() {
            shell.openExternal('https://github.com/luizf-lf/fluig-monitor');
          },
        },
        {
          label: t('menu.about.bugReport'),
          click() {
            shell.openExternal(
              'https://github.com/luizf-lf/fluig-monitor/issues/new/choose'
            );
          },
        },
      ],
    };

    const subMenuLanguages: MenuItemConstructorOptions = {
      label: t('menu.languages.label'),
      submenu: [
        {
          label: t('menu.languages.pt'),
          click: () => {
            i18n.changeLanguage('pt');
          },
        },
        {
          label: t('menu.languages.en'),
          click: () => {
            i18n.changeLanguage('en');
          },
        },
        {
          label: t('menu.languages.es'),
          click: () => {
            i18n.changeLanguage('es');
          },
        },
      ],
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd;

    return [subMenuView, subMenuEdit, subMenuLanguages, subMenuHelp];
  }

  // here we can change the menu buttons
  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: t('menu.file.label'),
        submenu: [
          {
            label: t('menu.file.quit'),
            accelerator: 'Ctrl+W',
            click: () => app.quit(),
          },
        ],
      },
      {
        label: t('menu.view.label'),
        submenu:
          process.env.NODE_ENV === 'development' ||
          process.env.DEBUG_PROD === 'true'
            ? [
                {
                  label: '&Reload',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  },
                },
                {
                  label: t('menu.view.toggleFS'),
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  },
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.webContents.toggleDevTools();
                  },
                },
              ]
            : [
                {
                  label: t('menu.view.toggleFS'),
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  },
                },
              ],
      },
      {
        label: t('menu.languages.label'),
        submenu: [
          {
            label: t('menu.languages.pt'),
            // type: 'radio',
            accelerator: 'Ctrl+L+1',
            click: () => {
              i18n.changeLanguage('pt');
            },
          },
          {
            label: t('menu.languages.en'),
            // type: 'radio',
            accelerator: 'Ctrl+L+2',
            click: () => {
              i18n.changeLanguage('en');
            },
          },
          {
            label: t('menu.languages.es'),
            accelerator: 'Ctrl+L+3',
            click: () => {
              i18n.changeLanguage('es');
            },
          },
        ],
      },
      {
        label: t('menu.about.label'),
        submenu: [
          {
            label: 'Github',
            click() {
              shell.openExternal('https://github.com/luizf-lf/fluig-monitor');
            },
          },
          {
            label: t('menu.about.bugReport'),
            click() {
              shell.openExternal(
                'https://github.com/luizf-lf/fluig-monitor/issues/new/choose'
              );
            },
          },
        ],
      },
    ];

    return templateDefault;
  }
}
