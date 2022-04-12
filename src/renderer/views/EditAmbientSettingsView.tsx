/* eslint-disable jsx-a11y/label-has-associated-control */
import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router';
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiCheck,
  FiRefreshCw,
  FiWifi,
  FiX,
} from 'react-icons/fi';
import AmbientViewParams from '../interfaces/AmbientViewParams';
import globalContainerVariants from '../../utils/globalContainerVariants';
import dbHandler from '../../utils/dbHandler';
import ambientKinds from '../../utils/defaultAmbientKinds';
import updateFrequencies from '../../utils/defaultUpdateFrequencies';
import AmbientDataInterface from '../interfaces/AmbientDataInterface';
import testConnection from '../../services/testConnection';

function EditAmbientSettingsView(): JSX.Element {
  console.log('-- EditAmbientSettingsView --');
  const { ambientUUID }: AmbientViewParams = useParams();
  console.log({ ambientUUID });
  const ambientData: AmbientDataInterface =
    dbHandler.ambients.getByUUID(ambientUUID);
  console.log({ ambientData });

  const [name, setName] = useState(ambientData.name);
  const [domainUrl, setDomainUrl] = useState(ambientData.baseUrl);
  const [kind, setKind] = useState(
    ambientKinds.find((i) => i.value === ambientData.kind)?.value
  );
  const [consumerKey, setConsumerKey] = useState(ambientData.auth.consumerKey);
  const [consumerSecret, setConsumerSecret] = useState(
    ambientData.auth.consumerSecret
  );
  const [accessToken, setAccessToken] = useState(ambientData.auth.accessToken);
  const [tokenSecret, setTokenSecret] = useState(ambientData.auth.tokenSecret);
  const [updateFrequency, setUpdateFrequency] = useState(
    updateFrequencies.find((i) => i.value === ambientData.update.frequency)
      ?.value
  );
  const [updateFrequencyFrom, setUpdateFrequencyFrom] = useState(
    ambientData.update.from
  );
  const [updateFrequencyTo, setUpdateFrequencyTo] = useState(
    ambientData.update.to
  );
  const [updateOnWorkDays, setUpdateOnWorkDays] = useState(
    ambientData.update.onlyOnWorkDays
  );

  const [testMessage, setTestMessage] = useState(<></>);
  const [validationMessage, setValidationMessage] = useState(<></>);

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

  function handleSave(event: FormEvent) {
    event.preventDefault();
    // TODO: Implement
  }

  function confirmDelete() {
    // TODO: Implement
  }

  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="centerViewContainer"
      className="ambientFormContainer"
    >
      <h1>Editar ambiente</h1>

      <form action="#" onSubmit={handleSave}>
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
          <button className="button is-default" type="submit">
            <FiCheck /> Salvar
          </button>
          <button
            className="button is-danger"
            type="button"
            onClick={confirmDelete}
          >
            <FiX /> Excluir Ambiente
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default EditAmbientSettingsView;
