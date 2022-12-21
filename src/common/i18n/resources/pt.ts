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
  },
  navbar: {
    actionButtons: {
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
};

export default pt;
