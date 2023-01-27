const pt = {
  menu: {
    about: {
      label: '&Sobre',
      aboutApp: 'Sobre o Fluig Monitor',
      bugReport: 'Reportar um bug',
    },
    languages: {
      label: '&Idioma',
      pt: '🇧🇷 Português',
      en: '🇺🇸 Inglês',
      es: '🇲🇽 Espanhol',
    },
    view: {
      label: '&Visualizar',
      toggleFS: 'Alternar tela cheia',
    },
    file: {
      label: '&Arquivo',
      quit: 'Sair',
    },
    systemTray: {
      running: 'Fluig Monitor em execução',
      open: 'Abrir',
      quit: 'Sair',
    },
  },
  navbar: {
    actionButtons: {
      updateDownloaded: 'Atualização Baixada. Clique para instalar.',
      updateAvailable: 'Atualização Disponível. Clique para baixar.',
      kioskMode: 'Habilitar Modo Quiosque',
      notifications: 'Abrir Notificações',
      theme: 'Alterar Tema',
      settings: 'Abrir Configurações',
    },
  },
  views: {
    CreateEnvironmentView: {
      createdSuccessfully: 'Ambiente cadastrado com sucesso.',
      connecting: 'Conectando ...',
      connectionError: 'Erro na conexão: ',
      connectionOk: 'Conexão Ok',
      connectionUnavailable:
        'Erro de conexão. Verifique a URL de domínio e a disponibilidade do servidor.',
      authFieldsValidation:
        'Preencha os campos de URL e autenticação para continuar.',
      back: 'Voltar',
      unableToEncrypt:
        'Não foi possível criptografar as chaves de autenticação',
      form: {
        title: 'Cadastrar novo ambiente',
        environmentDataSection: 'Dados do ambiente',
        environmentName: {
          label: 'Nome do ambiente:',
          placeholder: 'Ex.: Ambiente Exemplo 01',
        },
        domainUrl: {
          label: 'URL De Domínio:',
          placeholder: 'Ex.: https://teste.fluig.com',
        },
        environmentKind: {
          label: 'Tipo:',
          options: {
            prod: 'Produção',
            hml: 'Homologação',
            dev: 'Desenvolvimento',
          },
        },
        environmentAuthSection: 'Autenticação',
        consumerKey: {
          label: 'Consumer Key:',
          placeholder: 'Informe a consumer key',
        },
        consumerSecret: {
          label: 'Consumer Secret:',
          placeholder: 'Informe a consumer secret',
        },
        accessToken: {
          label: 'Access Token:',
          placeholder: 'Informe o access token',
        },
        tokenSecret: {
          label: 'Token Secret:',
          placeholder: 'Informe o token secret',
        },
        useEncryption: 'Criptografar chaves?',
        testConnection: 'Testar Conexão',
        serverVerification: {
          title: 'Verificação Do Servidor',
          label: 'Frequência',
          helper:
            'Tempo utilizado para a verificação da disponibilidade do servidor.',
          options: {
            '15s': '15 segundos',
            '30s': '30 segundos',
            '1m': '1 minuto',
            '2m': '2 minutos',
          },
        },
        dataCollection: {
          title: 'Coleta De Dados',
          label: 'Frequência',
          helper:
            'Tempo utilizado para a coleta de informações do monitor, licenças e estatísticas.',
          options: {
            '15m': '15 minutos',
            '30m': '30 minutos',
            '1h': '1 hora',
            '2h': '2 horas',
            '3h': '3 horas',
            '6h': '6 horas',
            '12h': '12 horas',
            '24h': '24 horas',
          },
        },
        buttonSubmit: 'Confirmar',
      },
    },
    EditEnvironmentView: {
      connecting: 'Conectando...',
      connectionError: 'Erro na conexão',
      connectionOk: 'Conexão Ok',
      insufficientPermissions: 'Usuário aplicativo sem permissões suficientes.',
      connectionUnavailable:
        'Erro de conexão. Verifique a URL de domínio e a disponibilidade do servidor.',
      authFieldsValidation:
        'Preencha os campos de URL e autenticação para continuar.',
      updateError:
        'Erro ao atualizar informações do ambiente, tente novamente.',
      updatedSuccessfully: 'Ambiente atualizado com sucesso',
      clickAgain: 'Clique novamente para confirmar a exclusão.',
      deletedSuccessfully: 'Ambiente excluído com sucesso.',
      back: 'Voltar',
      unableToEncrypt:
        'Não foi possível criptografar as chaves de autenticação',
      form: {
        title: 'Editar ambiente',
        environmentDataSection: 'Dados do ambiente',
        environmentName: {
          label: 'Nome do ambiente:',
          placeholder: 'Ex.: Ambiente Homologação',
        },
        domainUrl: {
          label: 'URL de domínio:',
          placeholder: 'Ex.: https://ambiente.teste:8080',
        },
        environmentKind: {
          label: 'Tipo:',
          options: {
            prod: 'Produção',
            hml: 'Homologação',
            dev: 'Desenvolvimento',
          },
        },
        environmentAuthSection: 'Autenticação',
        consumerKey: {
          label: 'Consumer Key:',
          placeholder: 'Informe a consumer key',
        },
        consumerSecret: {
          label: 'Consumer Secret:',
          placeholder: 'Informe a consumer secret',
        },
        accessToken: {
          label: 'Access Token:',
          placeholder: 'Informe o access token',
        },
        tokenSecret: {
          label: 'Token Secret:',
          placeholder: 'Informe o token secret',
        },
        useEncryption: 'Criptografar chaves?',
        testConnection: 'Testar Conexão',
        serverVerification: {
          title: 'Verificação Do Servidor',
          label: 'Frequência',
          helper:
            'Tempo utilizado para a verificação da disponibilidade do servidor.',
          options: {
            '15s': '15 segundos',
            '30s': '30 segundos',
            '1m': '1 minuto',
            '2m': '2 minutos',
          },
        },
        dataCollection: {
          title: 'Coleta De Dados',
          label: 'Frequência',
          helper:
            'Tempo utilizado para a coleta de informações do monitor, licenças e estatísticas.',
          options: {
            '15m': '15 minutos',
            '30m': '30 minutos',
            '1h': '1 hora',
            '2h': '2 horas',
            '3h': '3 horas',
            '6h': '6 horas',
            '12h': '12 horas',
            '24h': '24 horas',
          },
        },
        buttonSave: 'Salvar',
        buttonDelete: 'Excluir',
      },
    },
    HomeEnvironmentListView: {
      header: 'Seus Ambientes',
      createEnvironmentHelper:
        'Cadastre um novo ambiente utilizando o botão ao lado.',
    },
    EnvironmentDataContainer: {
      sideMenu: {
        summary: 'Resumo',
        database: 'Banco De Dados',
        detailedMemory: 'Memória Detalhada',
        artifacts: 'Artefatos',
        users: 'Usuários',
        settings: 'Configurações',
        minimize: 'Minimizar',
      },
    },
    AppSettingsView: {
      title: 'Configurações',
      settingsMenu: {
        categories: {
          general: 'Gerais',
          behavior: 'Comportamento',
          about: 'Sobre',
        },
        pages: {
          theme: 'Tema',
          language: 'Idioma',
          update: 'Atualizações',
          about: 'Sobre A Ferramenta',
          reportABug: 'Reporte Um Bug',
          systemTray: 'Bandeja Do Sistema',
        },
      },
      emptyRoute: {
        title: 'Configurações',
        helper:
          'Selecione um item ao lado para acessar as respectivas configurações.',
      },
    },
  },
  global: {
    environmentKinds: {
      HML: 'Homologação',
      DEV: 'Desenvolvimento',
      PROD: 'Produção',
    },
    environmentKindsShort: {
      HML: 'HML',
      DEV: 'DEV',
      PROD: 'PRD',
    },
  },
  helpMessages: {
    environments: {
      maximumExceeded: 'Você só pode favoritar até 3 ambientes.',
      added: 'Ambiente adicionado aos favoritos.',
      removed: 'Ambiente removido dos favoritos.',
    },
  },
  components: {
    global: {
      noData: 'Sem dados disponíveis',
      underDevelopment: 'Funcionalidade em desenvolvimento',
    },
    EnvironmentLicenses: {
      title: 'Licenças',
      usedLicenses: '%active% de %total% licenças usadas',
      remainingLicenses: '%remaining% restantes',
    },
    EnvironmentServerInfo: {
      title: 'Servidor',
      processor: 'Processador',
      memory: 'Memória',
      disk: 'Disco',
      activityTime: 'Tempo De Atividade',
      activityTimeDescription: '%days% dias, %hours% horas, %minutes% minutos',
    },
    EnvironmentServices: {
      title: 'Serviços',
      operational: 'Operacional',
      unused: 'Não Utilizado',
      failed: 'Com Falha',
    },
    EnvironmentStatusCard: {
      title: 'Status',
      responseTime: 'Tempo de resposta: %responseTime%ms',
      attention: 'Atenção',
      operational: 'Operacional',
      unavailable: 'Indisponível',
      operatingCorrectly: 'O servidor está online e operando corretamente.',
      highResponseTime:
        'O servidor está online, porém apresenta um tempo de resposta incomum.',
      noSatisfactoryResponse:
        'O servidor está online, porém não apresenta uma resposta satisfatória (HTTP %http%).',
      mayBeOffline:
        'É possível que o servidor esteja offline, veja detalhes abaixo: ',
    },
    EnvironmentStatusSummary: {
      updatedAt: 'Atualizado às',
      updatedAtAlt: 'Atualizado em',
    },
    SystemResources: {
      Disk: {
        title: 'Disco',
        used: 'Usado',
        outOf: 'de',
      },
      Memory: {
        title: 'Memória',
        used: 'Usado',
        outOf: 'de',
      },
      Database: {
        title: 'Banco De Dados',
        size: 'Tamanho',
        traffic: 'Tráfego',
        trafficNotAllowed: 'Tráfego não permitido',
      },
    },
    EnvironmentPerformanceGraph: {
      title: 'Performance',
      graphTitle: 'Tempo de resposta do servidor',
      last24h: 'Ultimas 24 horas',
      insufficientOrNoData: 'Sem dados ou dados insuficientes.',
      responseTime: 'Tempo De Resposta (ms)',
    },
    ThemeSettings: {
      title: 'Tema',
      helperText: 'Selecione abaixo o tema a ser utilizado pela aplicação:',
      whiteTheme: 'Tema Claro',
      darkTheme: 'Tema Escuro',
    },
    UpdatesSettings: {
      title: 'Atualizações',
      helperText:
        'Aqui você poderá escolher como a aplicação deverá se comportar com as atualizações.',
      enableAutoDownload: {
        label: 'Baixar atualizações automaticamente.',
        helper:
          'Ao habilitar esta opção, o Fluig Monitor irá baixar as atualizações disponível automaticamente.',
      },
      enableAutoInstall: {
        label: 'Instalar atualizações automaticamente.',
        helper:
          'Ao habilitar esta opção, o Fluig Monitor irá instalar as atualizações automaticamente após efetuar o download.',
      },
      updateFrequency: {
        helper: 'As atualizações são sempre verificadas diariamente.',
      },
    },
    LanguageSettings: {
      title: 'Idioma',
      helperText: 'Selecione abaixo o idioma a ser utilizado pela aplicação: ',
    },
    SystemTraySettings: {
      title: 'Bandeja Do Sistema',
      helperText:
        'Utilize esta opção para definir o comportamento da aplicação na bandeja do sistema.',
      minimizeToSystemTray: 'Minimizar para a bandeja do sistema',
      minimizeToSystemTrayHelper:
        'Ao habilitar esta opção, o Fluig Monitor será minimizado para a bandeja do sistema ao ser minimizado, e continuará em execução.',
      disableNotification: 'Desabilitar notificação',
      disableNotificationHelper:
        'Utilize esta opção para desabilitar a notificação de que o Fluig Monitor ainda está em execução.',
    },
    AboutSection: {
      title:
        'Uma ferramenta open-source para monitoramento de ambientes Fluig.',
      developedBy: 'Desenvolvido por ',
      disclosure:
        'Esta ferramenta vem sendo desenvolvida para fins de auto didática, e não possui nenhum vínculo com a TOTVS.',
      usageDisclosure:
        'O uso desta ferramenta é opcional, e portanto, seu funcionamento total ou parcial não é garantido para todos os tipos de ambientes Fluig.',
      learnMoreAt: 'Saiba mais sobre o projeto no repositório oficial no ',
    },
    ReportABugSection: {
      title: 'Reporte um bug',
      headline1:
        'Encontrou algum bug ou possui alguma sugestão de desenvolvimento sobre esta ferramenta?',
      headline2:
        'Você pode utilizar o botão abaixo para ser direcionado até a página de Issues do repositório no GitHub:',
      callToAction: 'Acessar',
    },
  },
  classes: {
    EnvironmentFormValidator: {
      nameIsRequired: 'Nome do ambiente é obrigatório.',
      baseUrlIsRequired: 'Endereço do ambiente é obrigatório.',
      consumerKeyIsRequired: 'Consumer Key é obrigatório.',
      consumerSecretIsRequired: 'Consumer Secret ambiente é obrigatório.',
      accessTokenIsRequired: 'Access Token é obrigatório.',
      tokenSecretIsRequired: 'Token Secret é obrigatório.',
      scrapeFrequencyIsRequired: 'Frequência de coleta é obrigatório.',
      pingFrequencyIsRequired: 'Frequência de verificação é obrigatório.',
    },
  },
  toasts: {
    HighResponseTime: {
      title: 'com ping algo.',
      message: 'O servidor está com um tempo de resposta muito alto.',
    },
    OperatingCorrectly: {
      title: 'operando normalmente.',
      message:
        'O servidor voltou a operar dentro do tempo de resposta correto.',
    },
    ServerAvailable: {
      title: 'disponível novamente.',
      message: 'O servidor voltou a operar novamente.',
    },
    ServerUnavailable: {
      title: 'indisponível.',
      message: 'O servidor aparenta estar offline. Verifique.',
    },
    StillAlive: {
      title: 'Ainda estou aqui.',
      message:
        'O Fluig Monitor está sendo executado na bandeja do sistema, você pode alterar este comportamento no painel de controle.',
    },
  },
  dialogs: {
    updateDialog: {
      title: 'Atualização disponível',
      message: 'Deseja atualizar o Fluig Monitor?',
      detail:
        'Uma nova atualização do Fluig Monitor foi baixada e está pronta para ser executada.',
      btnYes: 'Atualizar',
      btnNo: 'Cancelar',
    },
  },
};

export default pt;
