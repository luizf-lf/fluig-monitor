#

![Banner](./docs/img/banner.png)

<div align="center">

[![GitHub package.json version](https://img.shields.io/github/package-json/v/luizf-lf/fluig-monitor?color=green)](https://github.com/luizf-lf/fluig-monitor/releases)
[![GitHub all releases](https://img.shields.io/github/downloads/luizf-lf/fluig-monitor/total?color=blue)](https://github.com/luizf-lf/fluig-monitor/releases)
[![GitHub issues](https://img.shields.io/github/issues/luizf-lf/fluig-monitor)](https://github.com/luizf-lf/fluig-monitor/issues?q=is%3Aopen+is%3Aissue)
[![GitHub closed issues](https://img.shields.io/github/issues-closed/luizf-lf/fluig-monitor?color=green)](https://github.com/luizf-lf/fluig-monitor/issues?q=is%3Aissue+is%3Aclosed)
[![PT-BR](https://img.shields.io/badge/Language-PT--BR-green)](./README.md)
[![ENG](https://img.shields.io/badge/Language-ENG-blue)](./README.en.md)
[![wakatime](https://wakatime.com/badge/github/luizf-lf/fluig-monitor.svg)](https://wakatime.com/badge/github/luizf-lf/fluig-monitor)

</div>

## Aviso

> O **Fluig Monitor** não é mais ativamente mantido por mim. Isso significa que o este projeto não receberá novas atualizações, correções e nem receberá novas funcionalidades. Você ainda pode baixar o repositório do projeto, fazer alterações, instalar o app e utilizá-lo em sua última versão normalmente, porém, não terá garantias de estabilidade nem do funcionamento em novas versões do Fluig. Tomei esta decisão pois existem várias soluções de observabilidade mais robustas que cumprem a ideia inicial do Fluig Monitor (como a [stack do Grafana](https://grafana.com/about/grafana-stack/) para instalações on-premise e o próprio monitor da [TOTVS Cloud](https://www.totvs.com/cloud/) para instações em cloud). Este projeto foi um experimento de grande valia na minha carreira e no meu aprendizado como programador. Contudo, no momento optei por seguir em frente e priorizar novos projetos em minha vida.

## Índice

- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Imagens](#imagens)
- [Executando o projeto em modo de desenvolvimento](#executando-o-projeto-em-modo-de-desenvolvimento)
- [Estrutura Do Projeto](#estrutura-do-projeto)
  - [Visão Geral](#visão-geral)
  - [Estrutura do processo main](#estrutura-do-processo-main)
  - [Estrutura do processo renderer](#estrutura-do-processo-renderer)
- [Instruções De Uso](#instruções-de-uso)
  - [Monitorando um ambiente](#monitorando-um-ambiente)
- [Informações adicionais](#informações-adicionais)
- [Contribuindo](#contribuindo)

## Sobre

Uma aplicação desktop, desenvolvida em **Electron**, utilizada para monitorar ambientes **Fluig**.

O monitoramento é realizado através da **API Rest** da plataforma, também utilizada para coleta de dados do **monitor**, **estatísticas** e **licenças** da plataforma , conforme a [documentação](https://tdn.engpro.totvs.com.br/pages/releaseview.action?pageId=284881802).

Esta aplicação veio sendo desenvolvida inicialmente para fins **didáticos**, com a intenção de aprender sobre UI/UX, desenvolvimento de aplicações desktop com `React`, `Electron`, `Typescript`, e o uso das `APIs` do Fluig, mas aos poucos vem se tornando uma aplicação que possibilite gerir uma melhor observabilidade sobre a plataforma Fluig.

A aplicação possui um banco de dados SQLite que é criado automaticamente na primeira execução do aplicativo. Na build de produção, o mesmo ficará disponível na pasta `%appdata%/fluig-monitor/fluig-monitor.db`, no caso da versão de desenvolvimento, o mesmo será criado dentro da pasta `.prisma`, na raiz do projeto. Mais informações estão disponíveis nas instruções de execução do projeto abaixo.

As migrações entre as versões do banco de dados são executadas automaticamente, graças ao cliente do Prisma ORM embutido juntamente na aplicação.

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
- Telas de visão geral, banco de dados e memória detalhada do servidor.

Novas funcionalidades vem sendo estudadas constantemente. Verifique na aba [Issues](https://github.com/luizf-lf/fluig-monitor/issues) as melhorias que já foram mapeadas publicamente e/ou sugeridas por outras pessoas.

## Imagens

![Lista De Ambientes](./docs/img/HomeView.png)

> Lista De Ambientes, com mini gráfico de disponibilidade.

![Resumo - Modo Claro](./docs/img/EnvironmentView_White.png)

> Visão Do Ambiente (Tema Claro)

![Resumo - Modo Escuro](./docs/img/EnvironmentView_Dark.png)

> Visão Do Ambiente (Tema Escuro)

![Resumo - Inglês](./docs/img/EnvironmentView_English.png)

> Visão Do Ambiente (i18n em Inglês)

![Resumo - Indisponibilidade](./docs/img/EnvironmentView_Unavailable.png)

> Visão Do Ambiente (Indisponibilidade)

![Visão Do Banco De Dados](./docs/img/DatabaseView.png)

> Visão Do Banco de Dados

![Visão De Detalhes do Uso da Memória](./docs/img/DetailedMemoryView.png)

> Visão De Detalhes do Uso da Memória

## Executando o projeto em modo de desenvolvimento

1. Configure o arquivo .env:

   O repositório contem um arquivo `.env.example` com as configurações do caminho do banco de dados utilizado (SQLite). Copie o arquivo e o renomeie para `.env`, mantendo as mesmas configurações conforme arquivo de exemplo.

2. Instale as dependências necessárias:

   ```shell
   $ yarn
   ```

   ou

   ```shell
   $ npm install
   ```

3. Execute o projeto em modo de desenvolvimento:

   ```shell
   $ yarn start
   ```

   ou

   ```shell
   $ npm run start
   ```

   > Não é necessário executar nenhum comando do Prisma para migrar o banco de dados, pois as migrações são executadas automaticamente pela aplicação.

4. Executando a build de produção da aplicação (opcional).

   Caso desejar criar uma build de produção da aplicação, execute o comando a seguir:

   ```shell
   $ yarn package
   ```

   ou

   ```shell
   $ npm run package
   ```

## Estrutura Do Projeto

### Visão Geral

O Projeto é desenvolvido utilizando Electron, e por isso, utiliza de dois processos principais, o `main` e o `renderer`, onde o processo `main` é o processo principal do Electron, que funciona como o back-end da aplicação, e é responsável por lidar com operações HTTP, sistema de arquivos e schedule de tarefas, por exemplo. O processo `renderer` é o processo responsável pelo front-end da aplicação, que neste caso, é utilizado o React.

O projeto também possui uma pasta `common` contendo recursos compartilhados entre os dois processos, como interfaces, funções utilitárias e classes de validação.

Demonstração:

```text
src/
  ├── common/
  ├── main/
  └── renderer/
```

A estrutura de pastas poderá ser alterada conforme necessidade.

### Estrutura do processo main

A pasta referente ao processo `main` (src/main) foi estruturada da seguinte forma:

```text
src/
  ├── ...
  └── main/
        ├── classes/
        ├── controllers/
        ├── database/
        ├── generated/
        ├── interfaces/
        ├── services/
        ├── utils/
        └── ...
```

Onde:

- **classes:** Contém classes utilitárias utilizadas apenas pelo processo main.
- **controllers:** Contém os controllers principais da aplicação, responsáveis principalmente por operações com o banco de dados.
- **database:** Contém os utilitários de configuração do banco de dados com o prisma.
- **generated:** Contém arquivos gerados pelo prisma. São ignorados pelo git.
- **interfaces:** Contém interfaces utilizados pelo processo main.
- **services:** Contém funções / serviços que lidam com requisições HTTP ao Fluig.
- **utils:** Utilitários utilizados pelo processo main.

### Estrutura do processo renderer

A pasta referente ao processo `renderer` (src/renderer) foi estruturada da seguinte forma:

```text
src/
  ├── ...
  └── renderer/
        ├── assets/
        ├── classes/
        ├── components/
              ├── base/
              ├── container/
              └── layout/
        ├── contexts/
        ├── ipc/
        ├── pages/
        ├── utils/
        └── ...
```

Onde:

- **assets:** Contém arquivos de imagem, css e svg utilizados pelo renderer.
- **classes:** Contém classes utilizadas apenas pelo renderer, principalmente para validação de formulários.
- **components:** Contém os componentes React utilizados pelo renderer, estruturados da seguinte forma:
  - **base:** Contém componentes base, como botões customizados, por exemplo.
  - **container:** Contém componentes de negócio, como painéis de exibição de dados, por exemplo.
  - **layout:** Contém componentes que agrupam outros componentes, como uma dashboard por exemplo.
- **contexts:** Contém componentes de contexto que utilizam a Context API do React.
- **ipc:** Contém funções utilitárias que fazem a ponte com o processo main utilizando Inter Process Communication.
- **pages:** Contém componentes que funcionam como páginas, são vinculadas às rotas do React Router.
- **utils:** Contém funções utilitárias utilizadas pelo renderer.

## Instruções De Uso

### Monitorando um ambiente

Para começar a monitorar um ambiente, siga os passos a seguir:

1. Abra a aplicação. Ao abrir pela primeira vez, a aplicação irá criar o banco de dados (SQLite) e aplicar as migrações automaticamente.

2. Clique no botão de "+" na tela inicial ou na barra de navegação para incluir um novo ambiente.

3. Na tela que irá surgir, insira as informações do ambiente:

   **Nome do Ambiente:** O nome do ambiente a ser monitorado, esta informação é utilizada apenas para identificação pela aplicação.

   **Url de Domínio:** A url de domínio do ambiente, seguindo o padrão `protocolo://endereço:porta`, sem a barra no final da url. Exemplo: `https://teste.fluig.com` ou `http://dev.fluig.com:8080`

   **Autenticação:** Nos campos de autenticação, você deverá inserir os respectivos valores da Consumer Key, Consumer Secret, Access Token e Token Secret do usuário aplicativo criado na plataforma (Saiba mais em [Plataforma ❙ Oauth application](https://tdn.totvs.com/pages/releaseview.action?pageId=234455783)). É importante notar que este usuário aplicativo deve ser administrador ou possuir permissão sobre as APIs `/monitoring/api/v1/statistics/report`, `/monitoring/api/v1/monitors/report` e `/license/api/v1/licenses`. Para verificar se as configurações estão corretas, você pode utilizar o botão `Testar Conexão`.

   **Verificação do Servidor:** Neste campo, é possível definir a frequência de verificação da disponibilidade do servidor. Por exemplo, se escolher `15 segundos`, o servidor será verificado a cada 15 segundos.

   **Coleta de Dados:** Neste campo, é possível definir a frequência da coleta dos dados do **Monitor**, **Estatísticas** e **Licenças**. O período mínimo é de 15 minutos, que é o período mínimo que a plataforma utiliza para atualizar as informações coletadas das estatísticas do servidor.

4. Clique no botão confirmar. O ambiente será salvo, terá sua disponibilidade verificada e seus dados coletados pela primeira vez. Após clicar em salvar, você será direcionado para a tela inicial, contendo a lista dos ambientes sendo monitorados.

5. Acesse o ambiente através da lista na tela inicial ou da barra de navegação no topo.

6. As informações serão exibidas na dashboard na tela principal do ambiente. Caso um dos componentes nesta tela apresentar a informação "Sem dados disponíveis", pode ser que algum dado não tenha sido coletado corretamente devido à permissão do usuário aplicativo cadastrado. Neste caso, revise a permissão na plataforma Fluig e as configurações do ambiente cadastrado, e aguarde até que a próxima sincronização ocorra.

## Informações adicionais

Apesar de a aplicação já ter suas principais funcionalidades desenvolvidas (monitoramento, coleta e exibição de estatísticas) e já possuir uma release 1.0, novas funcionalidades e correções serão implementadas continuamente.
Verifique através da aba [Releases](https://github.com/luizf-lf/fluig-monitor/releases) a última versão disponível da aplicação.

## Contribuindo

Caso queira sugerir novas melhorias ou novas features para a aplicação, crie uma [issue](https://github.com/luizf-lf/fluig-monitor/issues) neste repositório, a viabilidade de sua sugestão será estudada e implementada de acordo.

Caso queira contribuir diretamente com o código fonte da aplicação, é recomendável realizar um **fork** deste repositório, e fazer suas alterações localmente, e então realizar um **pull request** contendo um descritivo de suas alterações realizadas para que as mudanças realizadas sejam implementadas.
