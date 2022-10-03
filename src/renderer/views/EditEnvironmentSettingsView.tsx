/* eslint-disable jsx-a11y/label-has-associated-control */
import { FormEvent, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Redirect, useParams } from 'react-router';
import log from 'electron-log';
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
import {
  deleteEnvironment,
  getEnvironmentById,
  updateEnvironment,
} from '../ipc/ipcHandler';
import environmentKinds from '../utils/defaultEnvironmentKinds';
import updateFrequencies from '../utils/defaultUpdateFrequencies';
import testConnection from '../services/testConnection';
import { useNotifications } from '../contexts/NotificationsContext';
import { useEnvironmentList } from '../contexts/EnvironmentListContext';
import { EnvironmentWithRelatedData } from '../../common/interfaces/EnvironmentControllerInterface';
import EnvironmentFormValidator from '../classes/EnvironmentFormValidator';

function EditEnvironmentSettingsView(): JSX.Element {
  const { environmentId }: EnvironmentViewParams = useParams();

  const [environmentData, setEnvironmentData] = useState(
    {} as EnvironmentWithRelatedData
  );

  const [name, setName] = useState('');
  const [domainUrl, setDomainUrl] = useState('');
  const [kind, setKind] = useState('');
  const [consumerKey, setConsumerKey] = useState('');
  const [consumerSecret, setConsumerSecret] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [tokenSecret, setTokenSecret] = useState('');
  const [updateFrequency, setUpdateFrequency] = useState('');
  const [updateFrequencyFrom, setUpdateFrequencyFrom] = useState('');
  const [updateFrequencyTo, setUpdateFrequencyTo] = useState('');
  const [updateOnWorkDays, setUpdateOnWorkDays] = useState(false);

  const [testMessage, setTestMessage] = useState(<></>);
  const [validationMessage, setValidationMessage] = useState(<></>);
  const [confirmBtnClicked, setConfirmBtnClicked] = useState(false);
  const [actionButtonsDisabled, setActionButtonsDisabled] = useState(false);

  const { createShortNotification } = useNotifications();
  const { updateEnvironmentList } = useEnvironmentList();

  useEffect(() => {
    async function getEnvironmentData() {
      const environmentDataById = await getEnvironmentById(
        Number(environmentId),
        true
      );

      if (environmentDataById) {
        setEnvironmentData(environmentDataById);
      }
    }

    if (typeof environmentId !== 'undefined') {
      getEnvironmentData();
    }
  }, [environmentId]);

  useEffect(() => {
    if (environmentData.id) {
      // const oAuthKeys = decodeKeys(oAuthKeys) // TODO Implement auth keys encode/decode
      const oAuthKeys =
        environmentData.oAuthKeysId.hash === 'json'
          ? JSON.parse(environmentData.oAuthKeysId.payload)
          : environmentData.oAuthKeysId.payload;

      setName(environmentData.name);
      setDomainUrl(environmentData.baseUrl);
      setKind(environmentData.kind);
      setConsumerKey(oAuthKeys.consumerKey);
      setConsumerSecret(oAuthKeys.consumerSecret);
      setAccessToken(oAuthKeys.accessToken);
      setTokenSecret(oAuthKeys.tokenSecret);
      setUpdateFrequency(environmentData.updateScheduleId.frequency);
      setUpdateFrequencyFrom(environmentData.updateScheduleId.from);
      setUpdateFrequencyTo(environmentData.updateScheduleId.to);
      setUpdateOnWorkDays(environmentData.updateScheduleId.onlyOnWorkDays);
    }
  }, [environmentData]);

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
      log.info(
        'EditEnvironmentSettingsView: Sending test connection to',
        domainUrl
      );
      setTestMessage(
        <span className="info-blip">
          <FiRefreshCw className="rotating" /> Conectando...
        </span>
      );

      setTimeout(async () => {
        const result = await testConnection(domainUrl, auth);

        if (typeof result !== 'undefined') {
          log.info('Test connection failed with status', result.status);
          if (result.status !== 200) {
            setTestMessage(
              <span className="info-blip has-warning">
                <FiAlertCircle /> Erro na conexão: {result.status}:{' '}
                {result.statusText}
              </span>
            );
          } else {
            log.info('Test connection done successfully (', result.status, ')');
            setTestMessage(
              <span className="info-blip has-success">
                <FiCheck /> Conexão Ok
              </span>
            );
          }
        } else {
          log.info('Test connection failed (server may be unavailable)');
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

  async function handleUpdateData(event: FormEvent) {
    log.info('EditEnvironmentSettingsView: Handling form submit');
    event.preventDefault();

    const formData = {
      id: environmentData.id,
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
    };

    const envFormValidator = new EnvironmentFormValidator().validate(formData);

    const { isValid, lastMessage } = envFormValidator;

    if (!isValid) {
      createShortNotification({
        id: Date.now(),
        type: 'error',
        message: lastMessage,
      });

      return;
    }

    log.info(
      'EditEnvironmentSettingsView: Form data is valid, updating environment'
    );

    const result = await updateEnvironment(
      {
        id: formData.id,
        baseUrl: formData.baseUrl,
        kind: formData.kind,
        name: formData.name,
        release: 'unknown',
      },
      {
        environmentId: formData.id,
        frequency: formData.update.frequency,
        from: formData.update.from,
        to: formData.update.to,
        onlyOnWorkDays: formData.update.onlyOnWorkDays,
      },
      {
        environmentId: formData.id,
        payload: JSON.stringify(formData.auth),
        hash: 'json',
      }
    );

    if (!result) {
      createShortNotification({
        id: Date.now(),
        type: 'error',
        message: 'Erro ao atualizar informações do ambiente, tente novamente.',
      });

      return;
    }

    setActionButtonsDisabled(true);
    createShortNotification({
      id: Date.now(),
      type: 'success',
      message: 'Ambiente atualizado com sucesso',
    });

    updateEnvironmentList();
    setValidationMessage(<Redirect to="/" />);
  }

  async function confirmDelete() {
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
      await deleteEnvironment(Number(environmentId));
      createShortNotification({
        id: Date.now(),
        type: 'success',
        message: 'Ambiente excluído com sucesso.',
      });
      setValidationMessage(<Redirect to="/" />);
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
