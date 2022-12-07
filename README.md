# Fluig Monitor

> Check out the **english** documentation [here](./docs/README.md).

![Banner](./docs/img/banner.png)

## Sobre

Uma aplicação desktop, desenvolvida em **Electron**, utilizada para monitorar ambientes **Fluig**.

O monitoramento é realizado através da **API Rest** da plataforma, também utilizada para coleta de dados do **monitor**, **estatísticas** e **licenças** da plataforma , conforme a [documentação](https://tdn.engpro.totvs.com.br/pages/releaseview.action?pageId=284881802).

Esta aplicação veio sendo desenvolvida inicialmente para fins **didáticos**, com a intenção de aprender sobre UI/UX, desenvolvimento de aplicações desktop com `React`, `Electron`, `Typescript`, e o uso das `APIs` do Fluig, mas aos poucos vem se tornando uma aplicação que possibilite gerir uma melhor observabilidade sobre a plataforma Fluig em si.

## Funcionalidades

Algumas das principais funcionalidades já implementadas:

- Interface totalmente customizada, com tema claro e escuro.
- Internacionalização (i18n) em Português e Inglês.
- Notificações no desktop.
- Verificação de disponibilidade de servidor.
- Coleta de informações do monitor, estatísticas e licenciamento da plataforma.
- Banco de dados local em SQLite.
- Migrações de banco de dados automáticas.
- Dashboard com gráfico de exibição de tempo de resposta da plataforma.

## Imagens

![Visão Do Ambiente (Tema Claro)](./docs/img/EnvironmentView_01-White.png)

> Visão Do Ambiente (Tema Claro)

![Visão Do Ambiente (Tema Escuro)](./docs/img/EnvironmentView_02-Dark.png)

> Visão Do Ambiente (Tema Escuro)

![Visão Do Ambiente (I18N)](./docs/img/EnvironmentView_03-EN.png)

> Visão Do Ambiente (I18N) em inglês.

![Visão Do Ambiente (Indisponibilidade)](./docs/img/EnvironmentView04-Unavailable.png)

> Visão Do Ambiente (Indisponibilidade)

![Lista De Ambientes](./docs/img/HomeView.png)

> Lista De Ambientes, com mini gráfico de disponibilidade.

## Execute o projeto

Para executar este projeto:

1. Instale as dependências necessárias:

   ```shell
   $ yarn
   ```

   ou

   ```shell
   $ npm install
   ```

2. Execute o projeto em modo de desenvolvimento:

   ```shell
   $ yarn start
   ```

   ou

   ```shell
   $ npm run start
   ```

## Informações adicionais

Apesar de a aplicação já ter suas principais funcionalidades desenvolvidas (monitoramento, coleta e exibição de estatísticas), ainda existem muitas funcionalidades que serão desenvolvidas ao longo do tempo até que a aplicação tenha uma release de versão inicial.
Atualmente a aplicação está em versão `preview`, disponível para aqueles que quiserem testar a aplicação.

### Tem alguma sugestão de desenvolvimento?

Crie uma [issue](https://github.com/luizf-lf/fluig-monitor/issues) neste repositório, a viabilidade de sua sugestão será estudada e implementada de acordo.
