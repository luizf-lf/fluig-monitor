# 1.0.1 

- Add shortcut keys for mac users (Undo, Redo, Cut, Copy, Paste, Paste and Match Style, Delete, Select All, Speech, AutoFiil, Start Dictation)

# 1.0.0 - Initial release version

- Updated some default settings values
- Refactored the IPC Handler
- Updated base view components
- Detailed memory view implemented
- Updated visible submenu features

# 0.5.0

- Fixed system resources components not being updated
- Changed get system resources methods to recover only the last resource
- Updated all data dependent components to a new responsive and self loading model (load data independently from layout)
- Created the database properties dashboard (From the environment view menu)
- Added a compatibility layer for Fluig 1.6.5 (Liquid) with version validation.
- Updated project structure.
- Updated language files to json format.
- Updated app settings view to a single page.

# 0.4.0

- Added a configurable minimize to system tray feature
- Deprecated the updateFrontEndTheme method in favor of the generic updateSettings method
- Fixed log rotation file name
- Added a default timeout to the FluigAPI class
- Last sync indicator added to some components
- Updates check and auto download implemented
- Implemented hash verification to the update file after being downloaded
- Old log files are now archived as compressed files.
- Updated major dependencies with breaking changes:
  - Electron 18 -> 22
  - React 17 -> 18
  - React-router 5.3 -> 6.6
- App Settings controller updated with default values and new methods.
- App updates are shown on the app navbar when available

# 0.3.0

- The app now validates if the oAuth user has sufficient permissions for data collection.
  - The validation occurs on the test connection button.
  - The validation occurs on the create / edit environment save button.
- Moved main process services to dedicated folder.
- Added a "report a bug" button on the "About" menu.
- Added a time period indicator on the server response time graph (Currently showing as "Last 24 hours")
- Added a "Under development" indicator to some views and components.
- Implemented a proper log file rotation with node-schedule.
- The app now recovers the environment release when the environment is added or edited.
- Implemented environment auth keys encryption option.
- Added a app settings component.
- Reduced log levels on the IPC channels.
- Settings panel layout implemented. Settings implemented:
  - Theme settings.
  - Language settings.
  - About section.
  - Report a bug section.
- Theme switcher implemented as a context.
- Added translation (i18n) to toast notifications.
- Database renamed from "app.db" to "fluig-monitor.db", with automatic legacy database detection and renaming.
- Log file name has been changed to "fluig-monitor.log".
- Added a "breathing" animation to the environment status indicator card.

# 0.2.1

- Implemented a mini line graph on the server list view from the last 20 ping responses (when there are responses)
- Fixed license component percentage precision
- Better organized app startup function (moved out from create main window function)
- Reduced log levels for the environment controller and IPC handler.
- Moved the Inter Process Communication handlers to a separated function.
- Fixed splash screen not being rendered on production build due to a file not being bundled.

# 0.2.0

- Updated test connection endpoint to /api/servlet/ping
- Changed environment availability check strategy
  - Now the app uses the ping api to check the server availability on a shorter interval (15s to 2min)
  - Statistics/Monitor/Licenses data scrape strategy updated. Data fetching occurs on bigger time intervals (15min to 24hours)
- Update only on work days option removed
- Update time span option removed
- Environment ping job implemented
- Menu environments indicator auto update implemented
- Environment view auto refresh implemented

# 0.1.4

- System resources components added:
  - Disk Info
  - Memory Info
  - Database Info
- Progress bar component updated
- Splash Screen added
- Environment status component added
- Environment Sync after environment creation implemented
- Environment api response performance graph added with Rechart.js

# 0.1.3

- Production build error fixed due to global constants not being properly loaded
- Licenses component added
- Server info component added
- Services status component added

# 0.1.2

- Persistent dark mode switcher implemented
- App settings controller implemented
- Front end IPC handlers separated by controller
- Favorite environment feature implemented
- Default server image added
- Spinner loading component added
- Environment view submenu routing implemented
- Fluig API Client class implemented
- Clear dev logs script updated
- Environment sync job added

# 0.1.1

- Translated environment edit view
- Updated database fields to include monitoring history

# 0.1.0

- Implemented database structure with Prisma ORM
- Migrated data interfaces on the front end
- Separated main, renderer and common project files
- Use of classes implemented
  - Class based controllers for all database operations
  - Custom form validator
- File logging with daily log rotation implemented

# 0.0.12

- Updated navbar components
- Removed profile picture
- Updated home environment list view

# 0.0.11

- Updated project folder structure strategy

# 0.0.10

- Fixed a big typo

# 0.0.9

- Updated database strategy - using separated files for environment data & user settings.

# 0.0.8

- New layout implemented
  - New logo & banner
  - New theme colors & UI design
  - Top navbar implemented (With environment shortcuts)
- Local .json database service added
- Dark theme variants added
- Notifications via Context API added (Custom notification component)
- i18n internationalization added
- Fluig API response typescript interface added
- Electron's IPC implemented
- Transitions & animations implemented using [Framer Motion](https://www.framer.com/motion/)
- Environment add form added
- Environment edit form added

# 0.0.1

- Project started with [ERB](https://github.com/electron-react-boilerplate/electron-react-boilerplate).
