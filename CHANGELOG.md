# 0.3-rc

- The app now validates if the oAuth user has sufficient permissions for data collection
  - The validation occurs on the test connection button
  - The validation occurs on the create / edit environment save button
- Moved main process services to dedicated folder.
- Added a "report a bug" button on the "About" menu
- Added a time indicator on the server response time graph (Currently showing as "Last 24 hours")

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
  - Now the app uses the ping api to check the server availability on a shorter interval (10s to 1min)
  - Statistics/Monitor/Licenses data scrape strategy updated. Data fetch occurs on larger time intervals (15min to 24hours)
- Update only on work days option removed
- Update time span option removed
- Environment ping job implemented
- Menu environments indicator auto update implemented
- Environment view auto refresh implemented

# 0.1.4

- System resources components added:
  - Disk Info
  - Memory Info
  - Databse Info
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
