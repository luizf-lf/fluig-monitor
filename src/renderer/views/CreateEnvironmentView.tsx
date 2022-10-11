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
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { useTranslation } from 'react-i18next';
import log from 'electron-log';
import { useEnvironmentList } from '../contexts/EnvironmentListContext';
import { useNotifications } from '../contexts/NotificationsContext';
import { createEnvironment } from '../ipc/environmentsIpcHandler';
import globalContainerVariants from '../utils/globalContainerVariants';
import EnvironmentFormValidator from '../classes/EnvironmentFormValidator';
import FluigAPIClient from '../../common/classes/FluigAPIClient';

export default function CreateEnvironmentView(): JSX.Element {
  const [name, setName] = useState('');
  const [domainUrl, setDomainUrl] = useState('');
  const [kind, setKind] = useState('PROD');
  const [consumerKey, setConsumerKey] = useState('');
  const [consumerSecret, setConsumerSecret] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [tokenSecret, setTokenSecret] = useState('');
  const [updateFrequency, setUpdateFrequency] = useState('15m');
  const [updateFrequencyFrom, setUpdateFrequencyFrom] = useState('');
  const [updateFrequencyTo, setUpdateFrequencyTo] = useState('');
  const [updateOnWorkDays, setUpdateOnWorkDays] = useState(false);

  const [testMessage, setTestMessage] = useState(<></>);
  const [validationMessage, setValidationMessage] = useState(<></>);

  const [actionButtonsDisabled, setActionButtonsDisabled] = useState(false);

  const { createShortNotification } = useNotifications();
  const { updateEnvironmentList } = useEnvironmentList();
  const { t } = useTranslation();

  async function handleSubmit(event: FormEvent) {
    log.info('CreateEnvironmentView: handling form submit.');
    event.preventDefault();

    const formData = {
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

    const envFormValidator = new EnvironmentFormValidator().validate(formData);

    const { isValid, lastMessage } = envFormValidator;

    if (isValid) {
      log.info('CreateEnvironmentView: Form is valid, creating environment.');
      await createEnvironment({
        environment: {
          baseUrl: formData.baseUrl,
          kind: formData.kind,
          name: formData.name,
          release: 'unknown',
        },
        updateSchedule: formData.update,
        environmentAuthKeys: {
          payload: JSON.stringify(formData.auth),
          hash: 'json',
        },
      });

      log.info(
        'CreateEnvironmentView: Environment created, redirecting to home view'
      );
      setActionButtonsDisabled(true);
      createShortNotification({
        id: Date.now(),
        type: 'success',
        message: t('views.CreateEnvironmentView.createdSuccessfully'),
      });

      updateEnvironmentList();
      setValidationMessage(<Redirect to="/" />);
    } else {
      createShortNotification({
        id: Date.now(),
        type: 'error',
        message: lastMessage,
      });
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
      log.info('CreateEnvironmentView: Sending test connection to', domainUrl);
      setTestMessage(
        <span className="info-blip">
          <FiRefreshCw className="rotating" />{' '}
          {t('views.CreateEnvironmentView.connecting')}
        </span>
      );

      setTimeout(async () => {
        const fluigClient = new FluigAPIClient({
          oAuthKeys: auth,
          requestData: {
            method: 'GET',
            url: `${domainUrl}/api/public/2.0/users/getCurrent`,
          },
        });

        await fluigClient.get();

        if (fluigClient.httpStatus) {
          if (fluigClient.httpStatus !== 200) {
            log.info(
              'Test connection failed with status',
              fluigClient.httpStatus
            );
            setTestMessage(
              <span className="info-blip has-warning">
                <FiAlertCircle />{' '}
                {t('views.CreateEnvironmentView.connectionError')} (
                {fluigClient.httpStatus})
              </span>
            );
          } else {
            log.info(
              'Test connection done successfully (',
              fluigClient.httpStatusText,
              ')'
            );
            setTestMessage(
              <span className="info-blip has-success">
                <FiCheck /> {t('views.CreateEnvironmentView.connectionOk')}
              </span>
            );
          }
        } else {
          log.info('Test connection failed (server may be unavailable)');
          setTestMessage(
            <span className="info-blip has-error">
              <FiAlertTriangle />{' '}
              {t('views.CreateEnvironmentView.connectionUnavailable')}
            </span>
          );
        }
      }, 100);
    } else {
      setTestMessage(
        <span className="info-blip has-warning">
          <FiAlertCircle />
          {t('views.CreateEnvironmentView.authFieldsValidation')}
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
      id="createEnvironmentContainer"
      className="environmentFormContainer"
    >
      <Link to="/" className="top-return-button">
        <FiArrowLeft />
        {t('views.CreateEnvironmentView.back')}
      </Link>
      <h1>{t('views.CreateEnvironmentView.form.title')}</h1>

      <form action="#" onSubmit={handleSubmit}>
        <h3>{t('views.CreateEnvironmentView.form.environmentDataSection')}</h3>

        <div className="form-group">
          <label htmlFor="environmentName">
            {t('views.CreateEnvironmentView.form.environmentName.label')}
          </label>
          <input
            type="text"
            name="environmentName"
            id="environmentName"
            placeholder={t(
              'views.CreateEnvironmentView.form.environmentName.placeholder'
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
              {t('views.CreateEnvironmentView.form.domainUrl.label')}
            </label>
            <input
              type="text"
              name="domainUrl"
              id="domainUrl"
              placeholder={t(
                'views.CreateEnvironmentView.form.domainUrl.placeholder'
              )}
              value={domainUrl}
              onChange={(event) => {
                setDomainUrl(event.target.value);
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="environmentKind">
              {t('views.CreateEnvironmentView.form.environmentKind.label')}
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
                  'views.CreateEnvironmentView.form.environmentKind.options.prod'
                )}
              </option>
              <option value="HML">
                {t(
                  'views.CreateEnvironmentView.form.environmentKind.options.hml'
                )}
              </option>
              <option value="DEV">
                {t(
                  'views.CreateEnvironmentView.form.environmentKind.options.dev'
                )}
              </option>
            </select>
          </div>
        </div>

        <h3 className="mt-1">
          {t('views.CreateEnvironmentView.form.environmentAuthSection')}
        </h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="consumerKey">
              {t('views.CreateEnvironmentView.form.consumerKey.label')}
            </label>
            <input
              type="text"
              name="consumerKey"
              id="consumerKey"
              placeholder={t(
                'views.CreateEnvironmentView.form.consumerKey.placeholder'
              )}
              value={consumerKey}
              onChange={(event) => {
                setConsumerKey(event.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="consumerSecret">
              {t('views.CreateEnvironmentView.form.consumerSecret.label')}
            </label>
            <input
              type="text"
              name="consumerSecret"
              id="consumerSecret"
              placeholder={t(
                'views.CreateEnvironmentView.form.consumerSecret.placeholder'
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
              {t('views.CreateEnvironmentView.form.accessToken.label')}
            </label>
            <input
              type="text"
              name="accessToken"
              id="accessToken"
              placeholder={t(
                'views.CreateEnvironmentView.form.accessToken.placeholder'
              )}
              value={accessToken}
              onChange={(event) => {
                setAccessToken(event.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="tokenSecret">
              {t('views.CreateEnvironmentView.form.tokenSecret.label')}
            </label>
            <input
              type="text"
              name="tokenSecret"
              id="tokenSecret"
              placeholder={t(
                'views.CreateEnvironmentView.form.tokenSecret.placeholder'
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
            <FiWifi /> {t('views.CreateEnvironmentView.form.testConnection')}
          </button>

          <span>{testMessage}</span>
        </div>

        <h3>{t('views.CreateEnvironmentView.form.settingsSection')}</h3>

        <div className="form-group">
          <label htmlFor="updateFrequency">
            {t('views.CreateEnvironmentView.form.updateFrequency.label')}
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
              {t('views.CreateEnvironmentView.form.updateFrequency.options.5m')}
            </option>
            <option value="10m">
              {t(
                'views.CreateEnvironmentView.form.updateFrequency.options.10m'
              )}
            </option>
            <option value="15m">
              {t(
                'views.CreateEnvironmentView.form.updateFrequency.options.15m'
              )}
            </option>
            <option value="30m">
              {t(
                'views.CreateEnvironmentView.form.updateFrequency.options.30m'
              )}
            </option>
            <option value="1h">
              {t('views.CreateEnvironmentView.form.updateFrequency.options.1h')}
            </option>
            <option value="2h">
              {t('views.CreateEnvironmentView.form.updateFrequency.options.2h')}
            </option>
            <option value="3h">
              {t('views.CreateEnvironmentView.form.updateFrequency.options.3h')}
            </option>
            <option value="6h">
              {t('views.CreateEnvironmentView.form.updateFrequency.options.6h')}
            </option>
            <option value="12h">
              {t(
                'views.CreateEnvironmentView.form.updateFrequency.options.12h'
              )}
            </option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="updateFrequencyFrom">
              {t('views.CreateEnvironmentView.form.updateFrequencyFrom')}
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
              {t('views.CreateEnvironmentView.form.updateFrequencyFromHelper')}
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
              {t('views.CreateEnvironmentView.form.updateFrequencyToHelper')}
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
              {t('views.CreateEnvironmentView.form.updateInWorkDays')}
            </label>
          </span>
        </div>

        <div className="button-action-row mt-1 mb-2">
          <button
            className="button is-default"
            type="submit"
            disabled={actionButtonsDisabled}
          >
            <FiCheck /> {t('views.CreateEnvironmentView.form.buttonSubmit')}
          </button>

          {validationMessage}
        </div>
      </form>
    </motion.div>
  );
}
