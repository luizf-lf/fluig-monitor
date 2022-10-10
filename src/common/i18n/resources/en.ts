const en = {
  menu: {
    about: {
      label: '&About',
      aboutApp: 'About Fluig Monitor',
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
    EnvironmentView: {
      empty:
        'Select the environment above or use the "New" button to create a new environment.',
    },
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
      form: {
        title: 'Create a new environment',
        environmentDataSection: 'Environment Info',
        environmentName: {
          label: 'Environment Name:',
          placeholder: 'Ex.: Example Environment 1',
        },
        domainUrl: {
          label: 'Domain URL:',
          placeholder: 'Ex.: https://test.fluig.com/',
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
        testConnection: 'Test Connection',
        settingsSection: 'Settings',
        updateFrequency: {
          label: 'Update Frequency:',
          options: {
            '5m': '5 Minutes',
            '10m': '10 Minutes',
            '15m': '15 Minutes',
            '30m': '30 Minutes',
            '1h': '1 Hour',
            '2h': '2 Hours',
            '3h': '3 Hours',
            '6h': '6 Hours',
            '12h': '12 Hours',
          },
        },
        updateFrequencyFrom: 'Update between these hours:',
        updateFrequencyFromHelper: 'Start',
        updateFrequencyToHelper: 'End',
        updateInWorkDays: 'Update only on work days',
        buttonSubmit: 'Confirm',
      },
    },
    EditEnvironmentView: {
      connecting: 'Connecting...',
      connectionError: 'Connection error',
      connectionOk: 'Connection Ok',
      connectionUnavailable:
        'Connection Error. Check the domain url and the server availability',
      authFieldsValidation:
        'Fill out the Domain URL and authentication fields to continue.',
      updateError: 'Error updating environment info, try again.',
      updatedSuccessfully: 'Environment updated successfully.',
      clickAgain: 'Click again to confirm the environment deletion',
      deletedSuccessfully: 'Environment deleted successfully.',
      back: 'Back',
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
        testConnection: 'Test Connection',
        settingsSection: 'Settings',
        updateFrequency: {
          label: 'Update Frequency:',
          options: {
            '5m': '5 Minutes',
            '10m': '10 Minutes',
            '15m': '15 Minutes',
            '30m': '30 Minutes',
            '1h': '1 Hour',
            '2h': '2 Hours',
            '3h': '3 Hours',
            '6h': '6 Hours',
            '12h': '12 Hours',
          },
        },
        updateFrequencyFrom: 'Update between these hours:',
        updateFrequencyFromHelper: 'Start',
        updateFrequencyToHelper: 'End',
        updateInWorkDays: 'Update only on working days',
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
};

export default en;
