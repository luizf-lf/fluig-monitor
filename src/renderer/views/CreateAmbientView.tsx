/* eslint-disable jsx-a11y/label-has-associated-control */
import { motion } from 'framer-motion';
import { FormEvent, useState } from 'react';
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiCheck,
  FiRefreshCw,
  FiWifi,
} from 'react-icons/fi';
import localStorageHandler from '../../utils/dbHandler';
import AmbientDataInterface from '../interfaces/AmbientDataInterface';
import testConnection from '../../services/testConnection';
import globalContainerVariants from '../../utils/globalContainerVariants';

import '../assets/styles/views/CreateAmbientView.scss';

export default function CreateAmbientView() {
  const ambientKinds = [
    { value: 'PROD', description: 'Produção' },
    { value: 'HOMOLOG', description: 'Homologação' },
    { value: 'DEV', description: 'Desenvolvimento' },
  ];
  const updateFrequencies = [
    { value: '5m', description: '5 Minutos' },
    { value: '10m', description: '10 Minutos' },
    { value: '15m', description: '15 Minutos' },
    { value: '30m', description: '30 Minutos' },
    { value: '1h', description: '1 Hora' },
    { value: '2h', description: '2 Horas' },
    { value: '3h', description: '3 Horas' },
    { value: '6h', description: '6 Horas' },
    { value: '12h', description: '12 Horas' },
  ];

  const [name, setName] = useState('');
  const [domainUrl, setDomainUrl] = useState('');
  const [kind, setKind] = useState(ambientKinds[0].value);
  const [consumerKey, setConsumerKey] = useState('');
  const [consumerSecret, setConsumerSecret] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [tokenSecret, setTokenSecret] = useState('');
  const [updateFrequency, setUpdateFrequency] = useState(
    updateFrequencies[2].value
  );
  const [updateFrequencyFrom, setUpdateFrequencyFrom] = useState('');
  const [updateFrequencyTo, setUpdateFrequencyTo] = useState('');
  const [updateOnWorkDays, setUpdateOnWorkDays] = useState(false);

  const [testMessage, setTestMessage] = useState(<></>);
  const [validationMessage, setValidationMessage] = useState(<></>);

  function validateCustomData(formData: AmbientDataInterface) {
    let isValid = false;
    let message = '';
    if (formData) {
      if (formData.name === '') {
        message = 'Nome do ambiente é obrigatório.';
      } else if (formData.baseUrl === '') {
        message = 'Endereço do ambiente é obrigatório.';
      } else if (formData.auth.consumerKey === '') {
        message = 'Consumer Key é obrigatório.';
      } else if (formData.auth.consumerSecret === '') {
        message = 'Consumer Secret ambiente é obrigatório.';
      } else if (formData.auth.accessToken === '') {
        message = 'Access Token é obrigatório.';
      } else if (formData.auth.tokenSecret === '') {
        message = 'Token Secret é obrigatório.';
      } else if (formData.update.from === '' || formData.update.to === '') {
        message = 'Horário de atualização é obrigatório.';
      } else {
        isValid = true;
      }
    }

    return { isValid, message };
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const formData: AmbientDataInterface = {
      name,
      baseUrl: domainUrl,
      kind,
      auth: {
        consumerKey,
        consumerSecret,
        accessToken,
        tokenSecret,
      },
      update: {
        frequency: updateFrequency,
        from: updateFrequencyFrom,
        to: updateFrequencyTo,
        onlyOnWorkDays: updateOnWorkDays,
      },
    };

    const { isValid, message } = validateCustomData(formData);

    if (isValid) {
      localStorageHandler.ambients.saveNew(formData);
      setValidationMessage(
        <span className="info-blip has-success">
          <FiCheck />
          Ambiente cadastrado com sucesso
        </span>
      );
    } else {
      setValidationMessage(
        <span className="info-blip has-error">
          <FiAlertCircle />
          {message}
        </span>
      );
    }
  }

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
              <FiAlertTriangle /> Erro de rede. Verifique a URL e a
              disponibilidade do servidor.
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

  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="createAmbientContainer"
    >
      <h1>Cadastrar novo ambiente</h1>

      <form action="#" onSubmit={handleSubmit}>
        <h3>Dados do ambiente</h3>

        <div className="form-group">
          <label htmlFor="ambientName">Nome do ambiente:</label>
          <input
            type="text"
            name="ambientName"
            id="ambientName"
            placeholder="Ex.: Ambiente Exemplo 01"
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
            <label htmlFor="ambientKind">Tipo:</label>
            <select
              name="ambientKind"
              id="ambientKind"
              value={kind}
              onChange={(event) => {
                setKind(event.target.value);
              }}
            >
              {ambientKinds.map(({ value, description }) => {
                return (
                  <option key={value} value={value}>
                    {description}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <h3>Autenticação</h3>
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
          <label htmlFor="updateFrequency">Frequencia de atualização:</label>
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
          <button className="button is-default" type="submit">
            <FiCheck /> Confirmar
          </button>

          {validationMessage}
        </div>
      </form>
    </motion.div>
  );
}