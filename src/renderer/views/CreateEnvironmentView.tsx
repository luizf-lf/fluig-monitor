/* eslint-disable prefer-destructuring */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { motion } from 'framer-motion';
import { ipcRenderer } from 'electron';
import { FormEvent, useState } from 'react';
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiArrowLeft,
  FiCheck,
  FiRefreshCw,
  FiWifi,
} from 'react-icons/fi';
import log from 'electron-log';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import { useEnvironmentList } from '../contexts/EnvironmentListContext';
import { useNotifications } from '../contexts/NotificationsContext';
import {
  createEnvironment,
  forceEnvironmentPing,
  forceEnvironmentSync,
  getEnvironmentReleaseIPC,
} from '../ipc/environmentsIpcHandler';
import globalContainerVariants from '../utils/globalContainerVariants';
import EnvironmentFormValidator from '../classes/EnvironmentFormValidator';
import AuthKeysEncoder from '../../common/classes/AuthKeysEncoder';

export default function CreateEnvironmentView(): JSX.Element {
  const [name, setName] = useState('');
  const [domainUrl, setDomainUrl] = useState('');
  const [kind, setKind] = useState('PROD');
  const [consumerKey, setConsumerKey] = useState('');
  const [consumerSecret, setConsumerSecret] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [tokenSecret, setTokenSecret] = useState('');
  const [useKeysEncryption, setUseKeysEncryption] = useState(true);

  const [scrapeFrequency, setScrapeFrequency] = useState('6h');
  const [pingFrequency, setPingFrequency] = useState('1m');

  const [testMessage, setTestMessage] = useState(<></>);
  const [validationMessage, setValidationMessage] = useState(<></>);

  const [actionButtonsDisabled, setActionButtonsDisabled] = useState(false);
  const [buttonIsLoading, setButtonIsLoading] = useState(false);

  const { createShortNotification } = useNotifications();
  const { updateEnvironmentList } = useEnvironmentList();
  const { t } = useTranslation();

  /**
   * Parse the domain url value.
   *  Checks if the domain url string has a "/" on the end.
   */
  function parseDomainUrl() {
    if (domainUrl.lastIndexOf('/') === domainUrl.length - 1) {
      setDomainUrl(domainUrl.substring(0, domainUrl.length - 1));
    }
  }

  /**
   * Dispatches the oAuth validator function caller
   */
  async function validateOauthPermission() {
    if (
      domainUrl !== '' &&
      (consumerKey !== '' ||
        consumerSecret !== '' ||
        accessToken !== '' ||
        tokenSecret !== '')
    ) {
      setTestMessage(
        <span className="info-blip">
          <FiRefreshCw className="rotating" />
          {t('views.CreateEnvironmentView.connecting')}
        </span>
      );

      const results = await ipcRenderer.invoke(
        'validateOauthPermission',
        {
          consumerKey,
          consumerSecret,
          accessToken,
          tokenSecret,
        },
        domainUrl
      );

      if (results.every((i: { httpStatus: number }) => i.httpStatus === 200)) {
        setTestMessage(
          <span className="info-blip has-success">
            <FiCheck /> {t('views.CreateEnvironmentView.connectionOk')}
          </span>
        );
      } else if (
        results.some(
          (i: { httpStatus: number }) =>
            i.httpStatus === 403 || i.httpStatus === 401
        )
      ) {
        setTestMessage(
          <span className="info-blip has-warning">
            <FiAlertCircle />
            {t('views.EditEnvironmentView.insufficientPermissions')}
            {` (${
              results.filter(
                (i: { httpStatus: number }) => i.httpStatus === 200
              ).length
            }/${results.length})`}
          </span>
        );
      } else {
        setTestMessage(
          <span className="info-blip has-error">
            <FiAlertTriangle />{' '}
            {t('views.CreateEnvironmentView.connectionUnavailable')}
          </span>
        );
      }
    } else {
      setTestMessage(
        <span className="info-blip has-warning">
          <FiAlertCircle />
          {t('views.CreateEnvironmentView.authFieldsValidation')}
        </span>
      );
    }
  }

  async function handleSubmit(event: FormEvent) {
    log.info('CreateEnvironmentView: handling form submit.');
    event.preventDefault();

    const fluigVersionRegex = /\d+\.\d+\.\d+/g;

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
      updateSchedule: {
        scrapeFrequency,
        pingFrequency,
      },
    };

    const envFormValidator = new EnvironmentFormValidator().validate(formData);
    const { isValid, lastMessage } = envFormValidator;
    let encryptedPayload = null;

    if (isValid) {
      log.info('CreateEnvironmentView: Form is valid, creating environment.');
      setActionButtonsDisabled(true);
      setButtonIsLoading(true);

      const permissionsResults = await ipcRenderer.invoke(
        'validateOauthPermission',
        {
          consumerKey,
          consumerSecret,
          accessToken,
          tokenSecret,
        },
        domainUrl
      );

      if (
        permissionsResults.every(
          (i: { httpStatus: number }) => i.httpStatus === 200
        )
      ) {
        let fluigRelease = 'unknown';
        const releaseResponse = await getEnvironmentReleaseIPC(
          {
            consumerKey,
            consumerSecret,
            accessToken,
            tokenSecret,
          },
          domainUrl
        );

        if (releaseResponse && releaseResponse.content) {
          const regexSearchIndex =
            releaseResponse.content.search(fluigVersionRegex);

          if (regexSearchIndex > -1) {
            fluigRelease = releaseResponse.content.slice(
              regexSearchIndex,
              releaseResponse.content.length
            );
          }
        }

        log.info(`Current environment release is ${fluigRelease}`);

        let environmentAuthKeys = {
          payload: '',
          hash: '',
        };

        if (useKeysEncryption) {
          log.info('Using encryption');
          encryptedPayload = new AuthKeysEncoder(formData.auth).encode();
          if (encryptedPayload) {
            environmentAuthKeys = {
              payload: encryptedPayload.encrypted,
              hash: `forge:${encryptedPayload.key}`,
            };
          } else {
            log.warn('Could not encrypt oAuth keys');
            createShortNotification({
              id: Date.now(),
              type: 'error',
              message: t('views.CreateEnvironmentView.unableToEncrypt'),
            });
            setButtonIsLoading(false);
            setActionButtonsDisabled(false);
            return;
          }
        } else {
          environmentAuthKeys = {
            payload: JSON.stringify(formData.auth),
            hash: 'json',
          };
        }

        const created = await createEnvironment({
          environment: {
            baseUrl: formData.baseUrl,
            kind: formData.kind,
            name: formData.name,
            release: fluigRelease,
          },
          updateSchedule: formData.updateSchedule,
          environmentAuthKeys,
        });

        if (useKeysEncryption && encryptedPayload !== null) {
          // maybe it's not a good idea to use the Store library,
          //  but in the meanwhile it's better than saving both keys on the same place.
          log.info(
            `Updating environment token for environment ${created.createdEnvironment.id}`
          );

          ipcRenderer.invoke(
            'setStoreValue',
            `envToken_${created.createdEnvironment.id}`,
            encryptedPayload.iv
          );
        }

        log.info(
          'CreateEnvironmentView: Environment created, syncing environments and redirecting to home view'
        );

        await forceEnvironmentSync();
        await forceEnvironmentPing();

        createShortNotification({
          id: Date.now(),
          type: 'success',
          message: t('views.CreateEnvironmentView.createdSuccessfully'),
        });

        updateEnvironmentList();
        setValidationMessage(<Navigate to="/" />);
      } else if (
        permissionsResults.some(
          (i: { httpStatus: number }) =>
            i.httpStatus === 403 || i.httpStatus === 401
        )
      ) {
        createShortNotification({
          id: Date.now(),
          type: 'warning',
          message: t('views.EditEnvironmentView.insufficientPermissions'),
        });
        setActionButtonsDisabled(false);
        setButtonIsLoading(false);
      } else {
        createShortNotification({
          id: Date.now(),
          type: 'error',
          message: 'Erro ao validar permissões.',
        });
        setActionButtonsDisabled(false);
        setButtonIsLoading(false);
      }
    } else {
      createShortNotification({
        id: Date.now(),
        type: 'error',
        message: t(`classes.EnvironmentFormValidator.${lastMessage}`),
      });
    }
  }

  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="createEnvironmentContainer"
      className="environment-form-container"
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
              onBlur={() => parseDomainUrl()}
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
              type="password"
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
              type="password"
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
              type="password"
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
              type="password"
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

        <div className="form-row">
          <div className="form-group inline">
            <input
              type="checkbox"
              name="useKeysEncryption"
              id="useKeysEncryption"
              checked={useKeysEncryption}
              onChange={(event) => {
                setUseKeysEncryption(event.target.checked);
              }}
            />
            <label htmlFor="useKeysEncryption">
              {t('views.CreateEnvironmentView.form.useEncryption')}
            </label>
          </div>
        </div>

        <div className="button-action-row mt-1 mb-2">
          <button
            type="button"
            className="button is-secondary"
            onClick={validateOauthPermission}
          >
            <FiWifi /> {t('views.CreateEnvironmentView.form.testConnection')}
          </button>

          <span>{testMessage}</span>
        </div>

        <h3>
          {t('views.CreateEnvironmentView.form.serverVerification.title')}
        </h3>

        <div className="form-group">
          <label htmlFor="pingUpdateFrequency">
            {t('views.CreateEnvironmentView.form.serverVerification.label')}
          </label>
          <select
            name="pingUpdateFrequency"
            id="pingUpdateFrequency"
            value={pingFrequency}
            onChange={(event) => {
              setPingFrequency(event.target.value);
            }}
          >
            <option value="15s">
              {t(
                'views.CreateEnvironmentView.form.serverVerification.options.15s'
              )}
            </option>
            <option value="30s">
              {t(
                'views.CreateEnvironmentView.form.serverVerification.options.30s'
              )}
            </option>
            <option value="1m">
              {t(
                'views.CreateEnvironmentView.form.serverVerification.options.1m'
              )}
            </option>
            <option value="2m">
              {t(
                'views.CreateEnvironmentView.form.serverVerification.options.2m'
              )}
            </option>
          </select>
          <small className="help-block">
            {t('views.CreateEnvironmentView.form.serverVerification.helper')}
          </small>
        </div>

        <h3 className="mt-1">
          {t('views.CreateEnvironmentView.form.dataCollection.title')}
        </h3>

        <div className="form-group">
          <label htmlFor="scrapeUpdateFrequency">
            {t('views.CreateEnvironmentView.form.dataCollection.label')}
          </label>
          <select
            name="scrapeUpdateFrequency"
            id="scrapeUpdateFrequency"
            value={scrapeFrequency}
            onChange={(event) => {
              setScrapeFrequency(event.target.value);
            }}
          >
            <option value="15m">
              {t('views.CreateEnvironmentView.form.dataCollection.options.15m')}
            </option>
            <option value="30m">
              {t('views.CreateEnvironmentView.form.dataCollection.options.30m')}
            </option>
            <option value="1h">
              {t('views.CreateEnvironmentView.form.dataCollection.options.1h')}
            </option>
            <option value="2h">
              {t('views.CreateEnvironmentView.form.dataCollection.options.2h')}
            </option>
            <option value="3h">
              {t('views.CreateEnvironmentView.form.dataCollection.options.3h')}
            </option>
            <option value="6h">
              {t('views.CreateEnvironmentView.form.dataCollection.options.6h')}
            </option>
            <option value="12h">
              {t('views.CreateEnvironmentView.form.dataCollection.options.12h')}
            </option>
            <option value="24h">
              {t('views.CreateEnvironmentView.form.dataCollection.options.24h')}
            </option>
          </select>
          <small className="help-block">
            {t('views.CreateEnvironmentView.form.dataCollection.helper')}
          </small>
        </div>

        <div className="button-action-row mt-1 mb-2">
          <button
            className="button is-default"
            type="submit"
            disabled={actionButtonsDisabled}
          >
            {buttonIsLoading ? (
              <>
                <FiRefreshCw className="rotating" />
              </>
            ) : (
              <>
                <FiCheck /> {t('views.CreateEnvironmentView.form.buttonSubmit')}
              </>
            )}
          </button>

          {validationMessage}
        </div>
      </form>
    </motion.div>
  );
}
