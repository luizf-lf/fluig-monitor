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
import { useTranslation } from 'react-i18next';
import EnvironmentViewParams from '../../common/interfaces/EnvironmentViewParams';
import globalContainerVariants from '../utils/globalContainerVariants';
import {
  deleteEnvironment,
  getEnvironmentById,
  updateEnvironment,
} from '../ipc/environmentsIpcHandler';
import testConnection from '../services/testConnection';
import { useNotifications } from '../contexts/NotificationsContext';
import { useEnvironmentList } from '../contexts/EnvironmentListContext';
import { EnvironmentWithRelatedData } from '../../common/interfaces/EnvironmentControllerInterface';
import EnvironmentFormValidator from '../classes/EnvironmentFormValidator';
import AuthKeysDecoder from '../classes/AuthKeysDecoder';

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

  const { t } = useTranslation();

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
      const oAuthKeys = new AuthKeysDecoder(
        environmentData.oAuthKeysId
      ).decode();

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
          <FiRefreshCw className="rotating" />
          {t('views.EditEnvironmentView.connecting')}
        </span>
      );

      setTimeout(async () => {
        const result = await testConnection(domainUrl, auth);

        if (typeof result !== 'undefined') {
          if (result.status !== 200) {
            log.info('Test connection failed with status', result.status);
            setTestMessage(
              <span className="info-blip has-warning">
                <FiAlertCircle />
                {t('views.EditEnvironmentView.connectionError')} {result.status}
                : {result.statusText}
              </span>
            );
          } else {
            log.info('Test connection done successfully (', result.status, ')');
            setTestMessage(
              <span className="info-blip has-success">
                <FiCheck /> {t('views.EditEnvironmentView.connectionOk')}
              </span>
            );
          }
        } else {
          log.info('Test connection failed (server may be unavailable)');
          setTestMessage(
            <span className="info-blip has-error">
              <FiAlertTriangle />
              {t('views.EditEnvironmentView.connectionUnavailable')}
            </span>
          );
        }
      }, 100);
    } else {
      setTestMessage(
        <span className="info-blip has-warning">
          <FiAlertCircle />
          {t('views.EditEnvironmentView.authFieldsValidation')}
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
        message: t('views.EditEnvironmentView.updateError'),
      });

      return;
    }

    setActionButtonsDisabled(true);
    createShortNotification({
      id: Date.now(),
      type: 'success',
      message: t('views.EditEnvironmentView.updatedSuccessfully'),
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
          message: t('views.EditEnvironmentView.clickAgain'),
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
        message: t('views.EditEnvironmentView.deletedSuccessfully'),
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
        {t('views.EditEnvironmentView.back')}
      </Link>
      <h1>{t('views.EditEnvironmentView.form.title')}</h1>

      <form action="#" onSubmit={handleUpdateData}>
        <h3>{t('views.EditEnvironmentView.form.environmentDataSection')}</h3>

        <div className="form-group">
          <label htmlFor="environmentName">
            {t('views.EditEnvironmentView.form.environmentName.label')}
          </label>
          <input
            type="text"
            name="environmentName"
            id="environmentName"
            placeholder={t(
              'views.EditEnvironmentView.form.environmentName.placeholder'
            )}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="domainUrl">
              {t('views.EditEnvironmentView.form.domainUrl.label')}
            </label>
            <input
              type="text"
              name="domainUrl"
              id="domainUrl"
              placeholder={t(
                'views.EditEnvironmentView.form.domainUrl.placeholder'
              )}
              value={domainUrl}
              onChange={(event) => {
                setDomainUrl(event.target.value);
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="environmentKind">
              {t('views.EditEnvironmentView.form.environmentKind.label')}
            </label>
            <select
              name="environmentKind"
              id="environmentKind"
              value={kind}
              onChange={(event) => {
                setKind(event.target.value);
              }}
            >
              <option value="PROD">
                {t(
                  'views.EditEnvironmentView.form.environmentKind.options.prod'
                )}
              </option>
              <option value="HML">
                {t(
                  'views.EditEnvironmentView.form.environmentKind.options.hml'
                )}
              </option>
              <option value="DEV">
                {t(
                  'views.EditEnvironmentView.form.environmentKind.options.dev'
                )}
              </option>
            </select>
          </div>
        </div>

        <h3 className="mt-1">
          {t('views.EditEnvironmentView.form.environmentAuthSection')}
        </h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="consumerKey">
              {t('views.EditEnvironmentView.form.consumerKey.label')}
            </label>
            <input
              type="text"
              name="consumerKey"
              id="consumerKey"
              placeholder={t(
                'views.EditEnvironmentView.form.consumerKey.placeholder'
              )}
              value={consumerKey}
              onChange={(event) => {
                setConsumerKey(event.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="consumerSecret">
              {t('views.EditEnvironmentView.form.consumerSecret.label')}
            </label>
            <input
              type="text"
              name="consumerSecret"
              id="consumerSecret"
              placeholder={t(
                'views.EditEnvironmentView.form.consumerSecret.placeholder'
              )}
              value={consumerSecret}
              onChange={(event) => {
                setConsumerSecret(event.target.value);
              }}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="accessToken">
              {t('views.EditEnvironmentView.form.accessToken.label')}
            </label>
            <input
              type="text"
              name="accessToken"
              id="accessToken"
              placeholder={t(
                'views.EditEnvironmentView.form.accessToken.placeholder'
              )}
              value={accessToken}
              onChange={(event) => {
                setAccessToken(event.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="tokenSecret">
              {t('views.EditEnvironmentView.form.tokenSecret.label')}
            </label>
            <input
              type="text"
              name="tokenSecret"
              id="tokenSecret"
              placeholder={t(
                'views.EditEnvironmentView.form.tokenSecret.placeholder'
              )}
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
            <FiWifi /> {t('views.EditEnvironmentView.form.testConnection')}
          </button>

          <span>{testMessage}</span>
        </div>

        <h3>{t('views.EditEnvironmentView.form.settingsSection')}</h3>
        <div className="form-group">
          <label htmlFor="updateFrequency">
            {t('views.EditEnvironmentView.form.updateFrequency.label')}
          </label>
          <select
            name="updateFrequency"
            id="updateFrequency"
            value={updateFrequency}
            onChange={(event) => {
              setUpdateFrequency(event.target.value);
            }}
          >
            <option value="5m">
              {t('views.EditEnvironmentView.form.updateFrequency.options.5m')}
            </option>
            <option value="10m">
              {t('views.EditEnvironmentView.form.updateFrequency.options.10m')}
            </option>
            <option value="15m">
              {t('views.EditEnvironmentView.form.updateFrequency.options.15m')}
            </option>
            <option value="30m">
              {t('views.EditEnvironmentView.form.updateFrequency.options.30m')}
            </option>
            <option value="1h">
              {t('views.EditEnvironmentView.form.updateFrequency.options.1h')}
            </option>
            <option value="2h">
              {t('views.EditEnvironmentView.form.updateFrequency.options.2h')}
            </option>
            <option value="3h">
              {t('views.EditEnvironmentView.form.updateFrequency.options.3h')}
            </option>
            <option value="6h">
              {t('views.EditEnvironmentView.form.updateFrequency.options.6h')}
            </option>
            <option value="12h">
              {t('views.EditEnvironmentView.form.updateFrequency.options.12h')}
            </option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="updateFrequencyFrom">
              {t('views.EditEnvironmentView.form.updateFrequencyFrom')}
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
            <small>
              {t('views.EditEnvironmentView.form.updateFrequencyFromHelper')}
            </small>
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
            <small>
              {t('views.EditEnvironmentView.form.updateFrequencyToHelper')}
            </small>
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
              {t('views.EditEnvironmentView.form.updateInWorkDays')}
            </label>
          </span>
        </div>

        <div className="button-action-row mt-1 mb-2">
          <button
            className="button is-default"
            type="submit"
            disabled={actionButtonsDisabled}
          >
            <FiCheck /> {t('views.EditEnvironmentView.form.buttonSave')}
          </button>
          <button
            className="button is-danger"
            type="button"
            onClick={confirmDelete}
            disabled={actionButtonsDisabled}
          >
            <FiX /> {t('views.EditEnvironmentView.form.buttonDelete')}
          </button>

          {validationMessage}
        </div>
      </form>
    </motion.div>
  );
}

export default EditEnvironmentSettingsView;
