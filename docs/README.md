# Fluig Monitor

> Confira a documentação em **português** clicando [aqui](../README.md).

![Banner](./img/banner.png)

## About

A desktop application, developed in **Electron**, used to monitor **Fluig** environments.

Monitoring is performed through the platform's **Rest API**, also used to collect **monitor** data, **statistics** and platform **license**, as per the [documentation](https://tdn.totvs.com/display/fluigeng/Platform+%7C+Platform+Services+Monitor).

This application was initially developed for **educational** purposes, with the intention of learning about UI/UX, development of desktop applications with `React`, `Electron`, `Typescript`, and the use of Fluig `API's`, but little by little it has become an application that allows better management of observability on the Fluig platform itself.

## Features

Algumas das principais funcionalidades já implementadas:

- Fully customized interface with light and dark theme.
- Internationalization (i18n) in Portuguese and English.
- Desktop notifications.
- Server availability check.
- Collection of monitor information, statistics and platform licensing.
- Local database in SQLite.
- Automatic database migrations.
- Dashboard with platform response time display graph.

## Images

### White Theme

![Environment View (White Theme)](./img/EnvironmentView_01-White.png)

> Environment View (White Theme)

![Environment View (Dark Theme)](./img/EnvironmentView_02-Dark.png)

> Environment View (Dark Theme)

![Environment View (I18N)](./img/EnvironmentView_03-EN.png)

> Environment View (I18N) in english.

![Environment View (Unavailability)](./img/EnvironmentView04-Unavailable.png)

> Environment View (Unavailability)

![Environment List](./img/HomeView.png)

> Environment List, with a mini availability graph.

## Running this project

To run this project:

1. Install the necessary dependencies:

   ```shell
   $ yarn
   ```

   or

   ```shell
   $ npm install
   ```

2. Run the app in development mode:

   ```shell
   $ yarn start
   ```

   or

   ```shell
   $ npm run start
   ```

## Additional Information

Although the application already has its main functionalities developed (monitoring, collection and display of statistics), there are still many functionalities that will be developed over time until the application has an initial version release.
Currently the application is in a `preview` release, available for those who want to test the application.

### Any development suggestions?

Create an [issue](https://github.com/luizf-lf/fluig-monitor/issues) on this repo, and the viability of your suggestion will be studied.
