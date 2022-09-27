/* eslint-disable jsx-a11y/label-has-associated-control */
import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { Redirect, useParams } from 'react-router';
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiArrowLeft,
  FiCheck,
  FiRefreshCw,
  FiWifi,
  FiX,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import EnvironmentViewParams from '../../common/interfaces/EnvironmentViewParams';
import globalContainerVariants from '../utils/globalContainerVariants';
import {} from '../utils/ipcHandler';
import environmentKinds from '../utils/defaultEnvironmentKinds';
import updateFrequencies from '../utils/defaultUpdateFrequencies';
import EnvironmentDataInterface from '../../common/interfaces/EnvironmentDataInterface';
import testConnection from '../services/testConnection';
import formUtils from '../utils/formUtils';
import { useNotifications } from '../contexts/NotificationsContext';
import { useEnvironmentList } from '../contexts/EnvironmentListContext';

function EditEnvironmentSettingsView(): JSX.Element {
  const { environmentUUID }: EnvironmentViewParams = useParams();
  const environmentData: EnvironmentDataInterface =
    dbHandler.environments.getByUUID(environmentUUID);

  const [name, setName] = useState(environmentData.name);
  const [domainUrl, setDomainUrl] = useState(environmentData.baseUrl);
  const [kind, setKind] = useState(
    environmentKinds.find((i) => i.value === environmentData.kind)?.value
  );
  const [consumerKey, setConsumerKey] = useState(
    environmentData.auth.consumerKey
  );
  const [consumerSecret, setConsumerSecret] = useState(
    environmentData.auth.consumerSecret
  );
  const [accessToken, setAccessToken] = useState(
    environmentData.auth.accessToken
  );
  const [tokenSecret, setTokenSecret] = useState(
    environmentData.auth.tokenSecret
  );
  const [updateFrequency, setUpdateFrequency] = useState(
    updateFrequencies.find((i) => i.value === environmentData.update.frequency)
      ?.value
  );
  const [updateFrequencyFrom, setUpdateFrequencyFrom] = useState(
    environmentData.update.from
  );
  const [updateFrequencyTo, setUpdateFrequencyTo] = useState(
    environmentData.update.to
  );
  const [updateOnWorkDays, setUpdateOnWorkDays] = useState(
    environmentData.update.onlyOnWorkDays
  );

  const [testMessage, setTestMessage] = useState(<></>);
  const [validationMessage, setValidationMessage] = useState(<></>);
  const [confirmBtnClicked, setConfirmBtnClicked] = useState(false);
  const [actionButtonsDisabled, setActionButtonsDisabled] = useState(false);

  const { createShortNotification } = useNotifications();
  const { updateEnvironmentList } = useEnvironmentList();

  function sendTestConnection() {
    const auth = {
      consumerKey,
      consumerSecret,
      accessToken,
      tokenSecret,
    };

    if (
      domainUrl !== '' &&
      (consumerKey !== '' ||
        consumerSecret !== '' ||
        accessToken !== '' ||
        tokenSecret !== '')
    ) {
      setTestMessage(
        <span className="info-blip">
          <FiRefreshCw className="rotating" /> Conectando...
        </span>
      );

      setTimeout(async () => {
        const result = await testConnection(domainUrl, auth);

        if (typeof result !== 'undefined') {
          if (result.status !== 200) {
            setTestMessage(
              <span className="info-blip has-warning">
                <FiAlertCircle /> Erro na conexão: {result.status}:{' '}
                {result.statusText}
              </span>
            );
          } else {
            setTestMessage(
              <span className="info-blip has-success">
                <FiCheck /> Conexão Ok
              </span>
            );
          }
        } else {
          setTestMessage(
            <span className="info-blip has-error">
              <FiAlertTriangle /> Erro de conexão. Verifique a URL de domínio e
              a disponibilidade do servidor.
            </span>
          );
        }
      }, 100);
    } else {
      setTestMessage(
        <span className="info-blip has-warning">
          <FiAlertCircle />
          Preencha os campos de URL e autenticação para continuar.
        </span>
      );
    }
  }

  function handleUpdateData(event: FormEvent) {
    event.preventDefault();

    const formData = {
      name,
      baseUrl: domainUrl,
      kind: kind ?? '',
      auth: {
        consumerKey,
        consumerSecret,
        accessToken,
        tokenSecret,
      },
      update: {
        frequency: updateFrequency ?? '',
        from: updateFrequencyFrom,
        to: updateFrequencyTo,
        onlyOnWorkDays: updateOnWorkDays,
      },
      createdAt: environmentData.createdAt,
      updatedAt: Date.now(),
      uuid: environmentData.uuid,
    };

    const { isValid, message } = formUtils.validate(formData);

    if (!isValid) {
      createShortNotification({
        id: Date.now(),
        type: 'error',
        message,
      });

      return;
    }

    // TODO: Update
    const result = dbHandler.environments.updateByUUID(
      environmentUUID,
      formData
    );

    if (!result) {
      createShortNotification({
        id: Date.now(),
        type: 'error',
        message:
          'Erro ao atualizar informações do environment, tente novamente.',
      });

      return;
    }

    setActionButtonsDisabled(true);
    createShortNotification({
      id: Date.now(),
      type: 'success',
      message:
        'Ambiente atualizado com sucesso. Redirecionando para a tela inicial...',
    });

    setTimeout(() => {
      updateEnvironmentList();
      setValidationMessage(<Redirect to="/" />);
    }, 3000);
  }

  function confirmDelete() {
    if (!confirmBtnClicked) {
      const timeout = 5000;
      setConfirmBtnClicked(true);
      createShortNotification(
        {
          id: Date.now(),
          type: 'warning',
          message: 'Clique novamente para confirmar a exclusão.',
        },
        timeout
      );
      setTimeout(() => setConfirmBtnClicked(false), timeout);
    } else {
      setActionButtonsDisabled(true);
      createShortNotification({
        id: Date.now(),
        type: 'success',
        message:
          'Ambiente excluído com sucesso. Redirecionando para a tela principal...',
      });
      setTimeout(() => {
        setValidationMessage(<Redirect to="/" />);

        // TODO: Update
        dbHandler.environments.deleteByUUID(environmentUUID);
      }, 3000);
    }
  }

  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="centerViewContainer"
      className="environmentFormContainer"
    >
      <Link to="/" className="top-return-button">
        <FiArrowLeft />
        Voltar
      </Link>
      <h1>Editar ambiente</h1>

      <form action="#" onSubmit={handleUpdateData}>
        <h3>Dados do ambiente</h3>

        <div className="form-group">
          <label htmlFor="environmentName">Nome do ambiente:</label>
          <input
            type="text"
            name="environmentName"
            id="environmentName"
            placeholder="Ex.: Environment Exemplo 01"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="domainUrl">URL De Domínio:</label>
            <input
              type="text"
              name="domainUrl"
              id="domainUrl"
              placeholder="Ex.: https://teste.fluig.com/"
              value={domainUrl}
              onChange={(event) => {
                setDomainUrl(event.target.value);
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="environmentKind">Tipo:</label>
            <select
              name="environmentKind"
              id="environmentKind"
              value={kind}
              onChange={(event) => {
                setKind(event.target.value);
              }}
            >
              {environmentKinds.map(({ value, description }) => {
                return (
                  <option key={value} value={value}>
                    {description}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <h3 className="mt-1">Autenticação</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="consumerKey">Consumer Key:</label>
            <input
              type="text"
              name="consumerKey"
              id="consumerKey"
              placeholder="Informe a consumer key"
              value={consumerKey}
              onChange={(event) => {
                setConsumerKey(event.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="consumerSecret">Consumer Secret:</label>
            <input
              type="text"
              name="consumerSecret"
              id="consumerSecret"
              placeholder="Informe a consumer secret"
              value={consumerSecret}
              onChange={(event) => {
                setConsumerSecret(event.target.value);
              }}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="accessToken">Access Token:</label>
            <input
              type="text"
              name="accessToken"
              id="accessToken"
              placeholder="Informe o access token"
              value={accessToken}
              onChange={(event) => {
                setAccessToken(event.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="tokenSecret">Token Secret:</label>
            <input
              type="text"
              name="tokenSecret"
              id="tokenSecret"
              placeholder="Informe o token secret"
              value={tokenSecret}
              onChange={(event) => {
                setTokenSecret(event.target.value);
              }}
            />
          </div>
        </div>

        <div className="button-action-row mt-1 mb-2">
          <button
            type="button"
            className="button is-secondary"
            onClick={sendTestConnection}
          >
            <FiWifi /> Testar Conexão
          </button>

          <span>{testMessage}</span>
        </div>

        <h3>Configurações</h3>
        <div className="form-group">
          <label htmlFor="updateFrequency">Frequência de atualização:</label>
          <select
            name="updateFrequency"
            id="updateFrequency"
            value={updateFrequency}
            onChange={(event) => {
              setUpdateFrequency(event.target.value);
            }}
          >
            {updateFrequencies.map(({ value, description }) => {
              return (
                <option value={value} key={value}>
                  {description}
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="updateFrequencyFrom">
              Atualizar entre este horário:
            </label>
            <input
              type="time"
              name="updateFrequencyFrom"
              id="updateFrequencyFrom"
              value={updateFrequencyFrom}
              onChange={(event) => {
                setUpdateFrequencyFrom(event.target.value);
              }}
            />
            <small>Início</small>
          </div>
          <div className="form-group">
            <input
              type="time"
              name="updateFrequencyTo"
              id="updateFrequencyTo"
              value={updateFrequencyTo}
              onChange={(event) => {
                setUpdateFrequencyTo(event.target.value);
              }}
            />
            <small>Fim</small>
          </div>
        </div>
        <div className="form-group">
          <span>
            <input
              type="checkbox"
              name="updateInWorkDays"
              id="updateInWorkDays"
              value={updateOnWorkDays === true ? 'on' : ''}
              checked={updateOnWorkDays === true}
              onChange={(event) => {
                setUpdateOnWorkDays(event.target.checked);
              }}
            />
            <label htmlFor="updateInWorkDays">
              {' '}
              Atualizar apenas em dias úteis
            </label>
          </span>
        </div>

        <div className="button-action-row mt-1 mb-2">
          <button
            className="button is-default"
            type="submit"
            disabled={actionButtonsDisabled}
          >
            <FiCheck /> Salvar
          </button>
          <button
            className="button is-danger"
            type="button"
            onClick={confirmDelete}
            disabled={actionButtonsDisabled}
          >
            <FiX /> Excluir Ambiente
          </button>

          {validationMessage}
        </div>
      </form>
    </motion.div>
  );
}

export default EditEnvironmentSettingsView;
