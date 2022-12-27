const en = {
  menu: {
    about: {
      label: '&About',
      aboutApp: 'About Fluig Monitor',
      bugReport: 'Report a bug',
    },
    languages: {
      label: '&Language',
      pt: '🇧🇷 Portuguese',
      en: '🇺🇸 English',
      es: '🇲🇽 Spanish',
    },
    view: {
      label: '&View',
      toggleFS: 'Toggle full screen',
    },
    file: {
      label: '&File',
      quit: 'Quit',
    },
  },
  navbar: {
    actionButtons: {
      kioskMode: 'Enable Kiosk Mode',
      notifications: 'Open Notifications',
      theme: 'Toggle Color Theme',
      settings: 'Open Settings',
    },
  },
  views: {
    CreateEnvironmentView: {
      createdSuccessfully: 'Environment created successfully',
      connecting: 'Connecting ...',
      connectionError: 'Connection Error: ',
      connectionOk: 'Connection Ok',
      connectionUnavailable:
        'Connection Error. Check the domain Url and the server availability.',
      authFieldsValidation:
        'Fill the url and authentication fields before continuing.',
      back: 'Back',
      unableToEncrypt: 'Unable to encrypt the authentication keys.',
      form: {
        title: 'Create a new environment',
        environmentDataSection: 'Environment Info',
        environmentName: {
          label: 'Environment Name:',
          placeholder: 'Ex.: Example Environment 1',
        },
        domainUrl: {
          label: 'Domain URL:',
          placeholder: 'Ex.: https://test.fluig.com',
        },
        environmentKind: {
          label: 'Kind:',
          options: {
            prod: 'Production',
            hml: 'Staging',
            dev: 'Development',
          },
        },
        environmentAuthSection: 'Authentication',
        consumerKey: {
          label: 'Consumer Key:',
          placeholder: 'Inform the consumer key',
        },
        consumerSecret: {
          label: 'Consumer Secret:',
          placeholder: 'Inform the consumer secret',
        },
        accessToken: {
          label: 'Access Token:',
          placeholder: 'Inform the access token',
        },
        tokenSecret: {
          label: 'Token Secret:',
          placeholder: 'Inform the token secret',
        },
        useEncryption: 'Encrypt keys?',
        testConnection: 'Test Connection',
        serverVerification: {
          title: 'Server Verification',
          label: 'Frequency',
          helper: 'Time used to verify the server availability',
          options: {
            '15s': '15 seconds',
            '30s': '30 seconds',
            '1m': '1 minute',
            '2m': '2 minutes',
          },
        },
        dataCollection: {
          title: 'Data Collection',
          label: 'Frequency',
          helper:
            'Time used between data collection of the Monitor, Licenses and Statistics',
          options: {
            '15m': '15 minutes',
            '30m': '30 minutes',
            '1h': '1 hour',
            '2h': '2 hours',
            '3h': '3 hours',
            '6h': '6 hours',
            '12h': '12 hours',
            '24h': '24 hours',
          },
        },
        buttonSubmit: 'Confirm',
      },
    },
    EditEnvironmentView: {
      connecting: 'Connecting...',
      connectionError: 'Connection error',
      connectionOk: 'Connection Ok',
      insufficientPermissions: 'User without sufficient permissions.',
      connectionUnavailable:
        'Connection Error. Check the domain url and the server availability',
      authFieldsValidation:
        'Fill out the Domain URL and authentication fields to continue.',
      updateError: 'Error updating environment info, try again.',
      updatedSuccessfully: 'Environment updated successfully.',
      clickAgain: 'Click again to confirm the environment deletion',
      deletedSuccessfully: 'Environment deleted successfully.',
      back: 'Back',
      unableToEncrypt: 'Unable to encrypt the authentication keys.',
      form: {
        title: 'Edit Environment',
        environmentDataSection: 'Environment Data',
        environmentName: {
          label: 'Environment Name:',
          placeholder: 'Eg.: Staging Environment',
        },
        domainUrl: {
          label: 'Domain URL:',
          placeholder: 'Eg.: https://staging.environment:8080',
        },
        environmentKind: {
          label: 'Kind:',
          options: {
            prod: 'Production',
            hml: 'Staging',
            dev: 'Development',
          },
        },
        environmentAuthSection: 'Authentication',
        consumerKey: {
          label: 'Consumer Key:',
          placeholder: 'Fill out the consumer key',
        },
        consumerSecret: {
          label: 'Consumer Secret:',
          placeholder: 'Fill out the consumer secret',
        },
        accessToken: {
          label: 'Access Token:',
          placeholder: 'Fill out the access token',
        },
        tokenSecret: {
          label: 'Token Secret:',
          placeholder: 'Fill out the token secret',
        },
        useEncryption: 'Encrypt keys?',
        testConnection: 'Test Connection',
        serverVerification: {
          title: 'Server Verification',
          label: 'Frequency',
          helper: 'Time used to verify the server availability',
          options: {
            '15s': '15 seconds',
            '30s': '30 seconds',
            '1m': '1 minute',
            '2m': '2 minutes',
          },
        },
        dataCollection: {
          title: 'Data Collection',
          label: 'Frequency',
          helper:
            'Time used between data collection of the Monitor, Licenses and Statistics',
          options: {
            '15m': '15 minutes',
            '30m': '30 minutes',
            '1h': '1 hour',
            '2h': '2 hours',
            '3h': '3 hours',
            '6h': '6 hours',
            '12h': '12 hours',
            '24h': '24 hours',
          },
        },
        buttonSave: 'Save',
        buttonDelete: 'Delete',
      },
    },
    HomeEnvironmentListView: {
      header: 'Your environments',
      createEnvironmentHelper:
        'Register a new environment using the button on the side.',
    },
    EnvironmentDataContainer: {
      sideMenu: {
        summary: 'Summary',
        database: 'Database',
        detailedMemory: 'Detailed Memory',
        artifacts: 'Artifacts',
        users: 'Users',
        settings: 'Settings',
        minimize: 'Minimize',
      },
    },
    AppSettingsView: {
      title: 'Configurações',
      settingsMenu: {
        categories: {
          general: 'General',
          about: 'About',
        },
        pages: {
          theme: 'Theme',
          language: 'Language',
          about: 'About',
          github: 'GitHub',
          reportABug: 'Report A Bug',
        },
      },
      emptyRoute: {
        title: 'Settings',
        helper: "Select an item on the side to access it's settings.",
      },
    },
  },
  global: {
    environmentKinds: {
      HML: 'Staging',
      DEV: 'Development',
      PROD: 'Production',
    },
    environmentKindsShort: {
      HML: 'STG',
      DEV: 'DEV',
      PROD: 'PRD',
    },
  },
  helpMessages: {
    environments: {
      maximumExceeded: 'You can only favorite up to 3 environments.',
      added: 'Environment added to favorites.',
      removed: 'Environment removed from favorites.',
    },
  },
  components: {
    global: {
      noData: 'No data to display',
      underDevelopment: 'Feature under development',
    },
    EnvironmentLicenses: {
      title: 'Licenses',
      usedLicenses: '%active% of %total% licenses used',
      remainingLicenses: '%remaining% remaining',
    },
    EnvironmentServerInfo: {
      title: 'Server',
      processor: 'Processor',
      memory: 'Memory',
      disk: 'Disk',
      activityTime: 'System Uptime',
      activityTimeDescription: '%days% days, %hours% hours, %minutes% minutes',
    },
    EnvironmentServices: {
      title: 'Services',
      operational: 'Operational',
      unused: 'Unused',
      failed: 'Fail',
    },
    EnvironmentStatusCard: {
      title: 'Status',
      responseTime: 'Response time: %responseTime%ms',
      attention: 'Attention',
      operational: 'Operational',
      unavailable: 'Unavailable',
      operatingCorrectly: 'The server is online and operating correctly.',
      highResponseTime:
        'The server is online, but has an uncommon response time.',
      noSatisfactoryResponse:
        'The server is online, but returned a non satisfactory response (HTTP %http%).',
      mayBeOffline:
        'It is possible that the server is offline. See details bellow: ',
    },
    EnvironmentStatusSummary: {
      updatedAt: 'Updated at',
      updatedAtAlt: 'Updated at',
    },
    SystemResources: {
      Disk: {
        title: 'Disk',
        used: 'Used',
        outOf: 'out of',
      },
      Memory: {
        title: 'Memory',
        used: 'Used',
        outOf: 'out of',
      },
      Database: {
        title: 'Database',
        size: 'Size',
        traffic: 'Traffic',
        trafficNotAllowed: 'Traffic not allowed',
      },
    },
    EnvironmentPerformanceGraph: {
      title: 'Performance',
      graphTitle: 'Server response time',
      last24h: 'Last 24 hours',
      insufficientOrNoData: 'Insufficient or no data available.',
      responseTime: 'Response Time (ms)',
    },
    ThemeSettings: {
      title: 'Theme',
      helperText: 'Select the theme to be used by the application bellow: ',
      whiteTheme: 'White Theme',
      darkTheme: 'Dark Theme',
    },
    LanguageSettings: {
      title: 'Language',
      helperText: 'Select the language to be used by the application bellow: ',
    },
  },
  classes: {
    EnvironmentFormValidator: {
      nameIsRequired: 'Environment name is required.',
      baseUrlIsRequired: 'Base url is required.',
      consumerKeyIsRequired: 'Consumer key is required.',
      consumerSecretIsRequired: 'Consumer secret is required.',
      accessTokenIsRequired: 'Access token is required.',
      tokenSecretIsRequired: 'Token secret is required.',
      scrapeFrequencyIsRequired: 'Scrape frequency is required.',
      pingFrequencyIsRequired: 'Ping frequency is required.',
    },
  },
};

export default en;
