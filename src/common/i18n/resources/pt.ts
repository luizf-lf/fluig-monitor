const pt = {
  menu: {
    about: {
      label: '&Sobre',
      aboutApp: 'Sobre o Fluig Monitor',
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
    EnvironmentView: {
      empty:
        'Selecione o ambiente acima ou utilize o botão "Novo" para criar um novo ambiente.',
    },
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
      form: {
        title: 'Cadastrar novo ambiente',
        environmentDataSection: 'Dados do ambiente',
        environmentName: {
          label: 'Nome do ambiente:',
          placeholder: 'Ex.: Ambiente Exemplo 01',
        },
        domainUrl: {
          label: 'URL De Domínio:',
          placeholder: 'Ex.: https://teste.fluig.com/',
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
        settingsSection: 'Configurações',
        updateFrequency: {
          label: 'Frequência de atualização:',
          options: {
            '5m': '5 Minutos',
            '10m': '10 Minutos',
            '15m': '15 Minutos',
            '30m': '30 Minutos',
            '1h': '1 Hora',
            '2h': '2 Horas',
            '3h': '3 Horas',
            '6h': '6 Horas',
            '12h': '12 Horas',
          },
        },
        updateFrequencyFrom: 'Atualizar entre este horário:',
        updateFrequencyFromHelper: 'Início',
        updateFrequencyToHelper: 'Fim',
        updateInWorkDays: 'Atualizar apenas em dias úteis',
        buttonSubmit: 'Confirmar',
      },
    },
    EditEnvironmentView: {
      connecting: 'Conectando...',
      connectionError: 'Erro na conexão',
      connectionOk: 'Conexão Ok',
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
        settingsSection: 'Configurações',
        updateFrequency: {
          label: 'Frequência de atualização:',
          options: {
            '5m': '5 Minutos',
            '10m': '10 Minutos',
            '15m': '15 Minutos',
            '30m': '30 Minutos',
            '1h': '1 Hora',
            '2h': '2 Horas',
            '3h': '3 Horas',
            '6h': '6 Horas',
            '12h': '12 Horas',
          },
        },
        updateFrequencyFrom: 'Atualizar entre este horário:',
        updateFrequencyFromHelper: 'Início',
        updateFrequencyToHelper: 'Fim',
        updateInWorkDays: 'Atualizar apenas em dias úteis',
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
    EnvironmentLicenses: {
      title: 'Licenças',
      usedLicenses: '%active% de %total% licenças usadas.',
      remainingLicenses: '%remaining% restantes.',
      noData: 'Sem dados disponíveis.',
    },
  },
};

export default pt;
