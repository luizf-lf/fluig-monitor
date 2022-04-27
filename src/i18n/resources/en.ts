const en = {
  menu: {
    about: {
      label: 'About',
      aboutApp: 'About Fluig Monitor',
    },
    languages: {
      label: 'Language',
      pt: '🇧🇷 Portuguese',
      en: '🇺🇸 English',
      es: '🇲🇽 Spanish',
    },
    view: {
      label: 'View',
      toggleFS: 'Toggle full screen',
    },
    file: {
      label: 'File',
      quit: 'Quit',
    },
  },
  views: {
    AmbientView: {
      empty:
        'Select the ambient above or use the "New" button to create a new ambient.',
    },
    CreateAmbientView: {
      createdSuccessfully:
        'Ambient created successfully. Redirecting to main page...',
      connecting: 'Connecting ...',
      connectionError: 'Connection Error: ',
      connectionOk: 'Connection Ok',
      connectionUnavailable:
        'Connection Error. Check the domain Url and the server availability.',
      authFieldsValidation:
        'Fill the url and authentication fields before continuing.',
      back: 'Back',
      form: {
        title: 'Create a new ambient',
        ambientDataSection: 'Ambient Info',
        ambientName: {
          label: 'Ambient Name:',
          placeholder: 'Ex.: Example Ambient 1',
        },
        domainUrl: {
          label: 'Domain URL:',
          placeholder: 'Ex.: https://test.fluig.com/',
        },
        ambientKind: {
          label: 'Kind:',
          options: {
            prod: 'Production',
            hml: 'Staging',
            dev: 'Development',
          },
        },
        ambientAuthSection: 'Authentication',
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
  },
};

export default en;
