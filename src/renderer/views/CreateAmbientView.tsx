/* eslint-disable jsx-a11y/label-has-associated-control */
import { motion } from 'framer-motion';
import { FormEvent, useState } from 'react';
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiArrowLeft,
  FiCheck,
  FiRefreshCw,
  FiWifi,
} from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../contexts/NotificationsContext';
import dbHandler from '../../utils/dbHandler';
import AmbientDataInterface from '../interfaces/AmbientDataInterface';
import testConnection from '../../services/testConnection';
import globalContainerVariants from '../../utils/globalContainerVariants';

import updateFrequencies from '../../utils/defaultUpdateFrequencies';
import formUtils from '../../utils/formUtils';

export default function CreateAmbientView() {
  const [name, setName] = useState('');
  const [domainUrl, setDomainUrl] = useState('');
  const [kind, setKind] = useState('PROD');
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

  const [actionButtonsDisabled, setActionButtonsDisabled] = useState(false);

  const { createShortNotification } = useNotifications();
  const { t } = useTranslation();

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
      createdAt: Date.now(),
      updatedAt: Date.now(),
      uuid: uuidv4(),
    };

    const { isValid, message } = formUtils.validate(formData);

    if (isValid) {
      dbHandler.ambients.saveNew(formData);

      setActionButtonsDisabled(true);
      createShortNotification({
        id: Date.now(),
        type: 'success',
        message: t('views.CreateAmbientView.createdSuccessfully'),
      });

      setTimeout(() => {
        setValidationMessage(<Redirect to="/" />);
      }, 3000);
    } else {
      createShortNotification({ id: Date.now(), type: 'error', message });
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
          <FiRefreshCw className="rotating" />{' '}
          {t('views.CreateAmbientView.connecting')}
        </span>
      );

      setTimeout(async () => {
        const result = await testConnection(domainUrl, auth);

        if (typeof result !== 'undefined') {
          if (result.status !== 200) {
            setTestMessage(
              <span className="info-blip has-warning">
                <FiAlertCircle /> {t('views.CreateAmbientView.connectionError')}{' '}
                {result.status}: {result.statusText}
              </span>
            );
          } else {
            setTestMessage(
              <span className="info-blip has-success">
                <FiCheck /> {t('views.CreateAmbientView.connectionOk')}
              </span>
            );
          }
        } else {
          setTestMessage(
            <span className="info-blip has-error">
              <FiAlertTriangle />{' '}
              {t('views.CreateAmbientView.connectionUnavailable')}
            </span>
          );
        }
      }, 100);
    } else {
      setTestMessage(
        <span className="info-blip has-warning">
          <FiAlertCircle />
          {t('views.CreateAmbientView.authFieldsValidation')}
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
      className="ambientFormContainer"
    >
      <Link to="/" className="top-return-button">
        <FiArrowLeft />
        {t('views.CreateAmbientView.back')}
      </Link>
      <h1>{t('views.CreateAmbientView.form.title')}</h1>

      <form action="#" onSubmit={handleSubmit}>
        <h3>{t('views.CreateAmbientView.form.ambientDataSection')}</h3>

        <div className="form-group">
          <label htmlFor="ambientName">
            {t('views.CreateAmbientView.form.ambientName.label')}
          </label>
          <input
            type="text"
            name="ambientName"
            id="ambientName"
            placeholder={t(
              'views.CreateAmbientView.form.ambientName.placeholder'
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
              {t('views.CreateAmbientView.form.domainUrl.label')}
            </label>
            <input
              type="text"
              name="domainUrl"
              id="domainUrl"
              placeholder={t(
                'views.CreateAmbientView.form.domainUrl.placeholder'
              )}
              value={domainUrl}
              onChange={(event) => {
                setDomainUrl(event.target.value);
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="ambientKind">
              {t('views.CreateAmbientView.form.ambientKind.label')}
            </label>
            <select
              name="ambientKind"
              id="ambientKind"
              value={kind}
              onChange={(event) => {
                setKind(event.target.value);
              }}
            >
              <option value="PROD">
                {t('views.CreateAmbientView.form.ambientKind.options.prod')}
              </option>
              <option value="HML">
                {t('views.CreateAmbientView.form.ambientKind.options.hml')}
              </option>
              <option value="DEV">
                {t('views.CreateAmbientView.form.ambientKind.options.dev')}
              </option>
            </select>
          </div>
        </div>

        <h3 className="mt-1">
          {t('views.CreateAmbientView.form.ambientAuthSection')}
        </h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="consumerKey">
              {t('views.CreateAmbientView.form.consumerKey.label')}
            </label>
            <input
              type="text"
              name="consumerKey"
              id="consumerKey"
              placeholder={t(
                'views.CreateAmbientView.form.consumerKey.placeholder'
              )}
              value={consumerKey}
              onChange={(event) => {
                setConsumerKey(event.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="consumerSecret">
              {t('views.CreateAmbientView.form.consumerSecret.label')}
            </label>
            <input
              type="text"
              name="consumerSecret"
              id="consumerSecret"
              placeholder={t(
                'views.CreateAmbientView.form.consumerSecret.placeholder'
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
              {t('views.CreateAmbientView.form.accessToken.label')}
            </label>
            <input
              type="text"
              name="accessToken"
              id="accessToken"
              placeholder={t(
                'views.CreateAmbientView.form.accessToken.placeholder'
              )}
              value={accessToken}
              onChange={(event) => {
                setAccessToken(event.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="tokenSecret">
              {t('views.CreateAmbientView.form.tokenSecret.label')}
            </label>
            <input
              type="text"
              name="tokenSecret"
              id="tokenSecret"
              placeholder={t(
                'views.CreateAmbientView.form.tokenSecret.placeholder'
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
            <FiWifi /> {t('views.CreateAmbientView.form.testConnection')}
          </button>

          <span>{testMessage}</span>
        </div>

        <h3>{t('views.CreateAmbientView.form.settingsSection')}</h3>

        <div className="form-group">
          <label htmlFor="updateFrequency">
            {t('views.CreateAmbientView.form.updateFrequency.label')}
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
              {t('views.CreateAmbientView.form.updateFrequency.options.5m')}
            </option>
            <option value="10m">
              {t('views.CreateAmbientView.form.updateFrequency.options.10m')}
            </option>
            <option value="15m">
              {t('views.CreateAmbientView.form.updateFrequency.options.15m')}
            </option>
            <option value="30m">
              {t('views.CreateAmbientView.form.updateFrequency.options.30m')}
            </option>
            <option value="1h">
              {t('views.CreateAmbientView.form.updateFrequency.options.1h')}
            </option>
            <option value="2h">
              {t('views.CreateAmbientView.form.updateFrequency.options.2h')}
            </option>
            <option value="3h">
              {t('views.CreateAmbientView.form.updateFrequency.options.3h')}
            </option>
            <option value="6h">
              {t('views.CreateAmbientView.form.updateFrequency.options.6h')}
            </option>
            <option value="12h">
              {t('views.CreateAmbientView.form.updateFrequency.options.12h')}
            </option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="updateFrequencyFrom">
              {t('views.CreateAmbientView.form.updateFrequencyFrom')}
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
              {t('views.CreateAmbientView.form.updateFrequencyFromHelper')}
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
              {t('views.CreateAmbientView.form.updateFrequencyToHelper')}
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
              onChange={(event) => {
                setUpdateOnWorkDays(event.target.checked);
              }}
            />
            <label htmlFor="updateInWorkDays">
              {' '}
              {t('views.CreateAmbientView.form.updateInWorkDays')}
            </label>
          </span>
        </div>

        <div className="button-action-row mt-1 mb-2">
          <button
            className="button is-default"
            type="submit"
            disabled={actionButtonsDisabled}
          >
            <FiCheck /> {t('views.CreateAmbientView.form.buttonSubmit')}
          </button>

          {validationMessage}
        </div>
      </form>
    </motion.div>
  );
}
