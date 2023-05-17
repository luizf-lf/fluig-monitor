#

![Banner](./docs/img/banner.png)

<div align="center">

[![GitHub package.json version](https://img.shields.io/github/package-json/v/luizf-lf/fluig-monitor?color=green)](https://github.com/luizf-lf/fluig-monitor/releases)
[![GitHub all releases](https://img.shields.io/github/downloads/luizf-lf/fluig-monitor/total?color=blue)](https://github.com/luizf-lf/fluig-monitor/releases)
[![GitHub issues](https://img.shields.io/github/issues/luizf-lf/fluig-monitor)](https://github.com/luizf-lf/fluig-monitor/issues?q=is%3Aopen+is%3Aissue)
[![GitHub closed issues](https://img.shields.io/github/issues-closed/luizf-lf/fluig-monitor?color=green)](https://github.com/luizf-lf/fluig-monitor/issues?q=is%3Aissue+is%3Aclosed)
[![PT-BR](https://img.shields.io/badge/Language-PT--BR-green)](./README.md)
[![ENG](https://img.shields.io/badge/Language-ENG-blue)](./README.en.md)
[![wakatime](https://wakatime.com/badge/github/luizf-lf/fluig-monitor.svg)](https://wakatime.com/badge/github/luizf-lf/fluig-monitor)

</div>

## Table Of Contents

- [About](#about)
- [Features](#features)
- [Images](#images)
- [Running the project in development mode](#running-the-project-in-development-mode)
- [Project Structure](#project-structure)
  - [Overview](#overview)
  - [Structure of the main process](#structure-of-the-main-process)
  - [Structure of the renderer process](#structure-of-the-renderer-process)
- [Instructions for use](#instructions-for-use)
  - [Registering an environment](#registering-an-environment)
- [Additional Information](#additional-information)
- [Contributing](#contributing)

## About

A desktop application, developed in **Electron**, used to monitor **Fluig** environments.

Monitoring is performed through the platform's **Rest API**, also used to collect **monitor** data, **statistics** and platform **license**, as per the [documentation](https://tdn.totvs.com/display/fluigeng/Platform+%7C+Platform+Services+Monitor).

This application was initially developed for **educational** purposes, with the intention of learning about UI/UX, development of desktop applications with `React`, `Electron`, `Typescript`, and the use of Fluig `API's`, but little by little it has become an application that allows better management of observability on the Fluig platform itself.

The application has an SQLite database that is automatically created on the first application run. In the production build, it will be available in the `%appdata%/fluig-monitor/fluig-monitor.db` folder, in the case of the development version, it will be created in the `.prisma` folder, in the root of the project. More information is available in the project execution instructions below.

Migrations between database versions are performed automatically, thanks to the Prisma ORM client built into the application.

## Features

Some of the main features already implemented:

- Fully customized interface with light and dark theme.
- Internationalization (i18n) in Portuguese and English.
- Desktop notifications.
- Server availability check.
- Collection of monitor information, statistics and platform licensing.
- Local database in SQLite.
- Automatic database migrations.
- Dashboard with platform response time display graph.

New features are constantly being studied. Check the [Issues](https://github.com/luizf-lf/fluig-monitor/issues) tab for improvements that have already been publicly mapped and/or suggested by others.

## Images

### White Theme

![Environment View (White Theme)](./docs/img/EnvironmentView_01-White.png)

> Environment View (White Theme)

![Environment View (Dark Theme)](./docs/img/EnvironmentView_02-Dark.png)

> Environment View (Dark Theme)

![Environment View (I18N)](./docs/img/EnvironmentView_03-EN.png)

> Environment View (I18N) in english.

![Environment View (Unavailability)](./docs/img/EnvironmentView04-Unavailable.png)

> Environment View (Unavailability)

![Environment List](./docs/img/HomeView.png)

> Environment List, with a mini availability graph.

## Running the project in development mode

1. Configure the .env file:

   The repository contains an `.env.example` file with the database (SQLite) path settings used. Copy the file and rename it to `.env`, keeping the same settings as the example file.

2. Install the necessary dependencies:

   ```shell
   $ yarn
   ```

   or

   ```shell
   $ npm install
   ```

3. Run the app in development mode:

   ```shell
   $ yarn start
   ```

   or

   ```shell
   $ npm run start
   ```

   > It is not necessary to run any Prisma command to migrate the database, as the migrations are performed automatically by the application.

4. Running the production build of the application (optional).

   If you want to create a production build of the application, run the following command:

   ```shell
   $ yarn package
   ```

   or

   ```shell
   $ npm run package
   ```

## Project Structure

### Overview

The Project is developed using Electron, and therefore, it uses two main processes, the `main` and the `renderer`, where the `main` process is the main Electron process, which works as the back-end of the application, and is responsible for handling HTTP operations, file system and task scheduling, for example. The `renderer` process is the process responsible for the front-end of the application, which in this case uses React.

The project also has a `common` folder containing shared resources between the two processes, such as interfaces, utility functions and validation classes.

Demonstration:

```text
src/
   ├── common/
   ├── main/
   └── renderer/
```

The folder structure can be changed as needed.

### Structure of the main process

The folder referring to the `main` process (src/main) was structured as follows:

```text
src/
   ├── ...
   └── main/
         ├── classes/
         ├── controllers/
         ├── database/
         ├── generated/
         ├── interfaces/
         ├── services/
         ├── utils/
         └── ...
```

Where:

- **classes:** Contains utility classes used only by the main process.
- **controllers:** Contains the application's main controllers, responsible mainly for operations with the database.
- **database:** Contains the database configuration utilities with Prisma.
- **generated:** Contains files generated by Prisma. They are ignored by git.
- **interfaces:** Contains interfaces used by the main process.
- **services:** Contains functions / services that handle HTTP requests to Fluig.
- **utils:** Utilities used by the main process.

### Structure of the renderer process

The folder referring to the `renderer` process (src/renderer) was structured as follows:

```text
src/
   ├── ...
   └── renderer/
         ├── assets/
         ├── classes/
         ├── components/
               ├── base/
               ├── container/
               └── layout/
         ├── contexts/
         ├── ipc/
         ├── pages/
         ├── utils/
         └── ...
```

Where:

- **assets:** Contains image, css and svg files used by the renderer.
- **classes:** Contains classes used only by the renderer, mainly for form validation.
- **components:** Contains the React components used by the renderer, structured as follows:
  - **base:** Contains base components, like custom buttons, for example.
  - **container:** Contains business components, such as data display panels, for example.
  - **layout:** Contains components that group other components, such as a dashboard for example.
- **contexts:** Contains context components that use React's Context API.
- **ipc:** Contains utility functions that bridge the main process using Inter Process Communication.
- **pages:** Contains components that work as pages, are linked to React Router routes.
- **utils:** Contains utility functions used by the renderer.

## Instructions for use

### Registering an environment

To start monitoring an environment, follow these steps:

1. Open the app. When opened for the first time, the application will create the database (SQLite) and apply the updates automatically.

2. Click the "+" button on the home screen or navigation bar to add a new environment.

3. On the screen that will appear, enter the following environment information:

   **Environment Name:** The name of the environment to be monitored, this information is used only for identification by the application.

   **Domain Url:** The environment's domain url, following the `protocol://address:port` pattern, without the slash at the end of the url. Example: `https://test.fluig.com` or `https://dev.fluig.com:8080`

   **Authentication:** In the authentication fields, you must enter the respective values of the Consumer Key, Consumer Secret, Access Token and Token Secret of the application user created on the platform. It is important to note that this application user must be an administrator or have permission on the APIs `/monitoring/api/v1/statistics/report`, `/monitoring/api/v1/monitors/report` and `/license/api/v1/licenses`. To check if the settings are correct, you can use the `Test Connection` button.

   **Server Verification:** In this field, you can define the frequency of checking the availability of the server. For example, if you choose `15 seconds`, the server will be checked every 15 seconds.

   **Data Collection:** In this field, it is possible to define the frequency of data collection from **Monitor**, **Statistics** and **Licenses**.

4. Click on the **confirm** button. The environment will be saved, its availability checked and its data collected for the first time. After clicking save, you will be directed to the home screen, containing the list of environments being monitored.

5. Access the environment through the list on the home screen or the navigation bar at the top.

6. The information will be displayed on the dashboard on the main screen of the environment. If one of the components on this screen displays the information "No data available", it may be that some data has not been collected propperly due to the permission of the application user. In this case, review the permissions on the Fluig platform and the settings of the registered environment, and wait until the next synchronization takes place.

## Additional Information

Although the application already has its main functionalities developed (monitoring, collection and display of statistics), there are still many functionalities that will be developed over time until the application has an initial version release.
Currently the application is in a `preview` release, available trough the [Releases](https://github.com/luizf-lf/fluig-monitor/releases) tab for those who want to test the application.

## Contributing

If you want to suggest new improvements or new features for the application, create an [issue](https://github.com/luizf-lf/fluig-monitor/issues) in this repository, the feasibility of your suggestion will be studied and implemented accordingly.

If you want to contribute directly to the source code of the application, it is recommended to perform a **fork** of this repository, and make your changes locally, and then perform a **pull request** containing a description of your changes made so that the changes carried out are implemented.
