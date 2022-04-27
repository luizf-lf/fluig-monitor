const pt = {
  menu: {
    about: {
      label: 'Sobre',
      aboutApp: 'Sobre o Fluig Monitor',
    },
    languages: {
      label: 'Idioma',
      pt: '🇧🇷 Português',
      en: '🇺🇸 Inglês',
      es: '🇲🇽 Espanhol',
    },
    view: {
      label: 'Visualizar',
      toggleFS: 'Alternar tela cheia',
    },
    file: {
      label: 'Arquivo',
      quit: 'Sair',
    },
  },
  views: {
    AmbientView: {
      empty:
        'Selecione o ambiente acima ou utilize o botão "Novo" para criar um novo ambiente.',
    },
    CreateAmbientView: {
      createdSuccessfully:
        'Ambiente cadastrado com sucesso. Redirecionando para a tela inicial...',
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
        ambientDataSection: 'Dados do ambiente',
        ambientName: {
          label: 'Nome do ambiente:',
          placeholder: 'Ex.: Ambiente Exemplo 01',
        },
        domainUrl: {
          label: 'URL De Domínio:',
          placeholder: 'Ex.: https://teste.fluig.com/',
        },
        ambientKind: {
          label: 'Tipo:',
          options: {
            prod: 'Produção',
            hml: 'Homologação',
            dev: 'Desenvolvimento',
          },
        },
        ambientAuthSection: 'Autenticação',
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
          label: 'Frequência de atualização::',
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
  },
};

export default pt;
