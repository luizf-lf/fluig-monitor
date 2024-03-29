import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { ipcRenderer } from 'electron';
import { useTranslation } from 'react-i18next';

import { DatabaseProperties } from '../../../main/controllers/StatisticsHistoryController';
import { getDatabaseProperties } from '../../ipc/environmentsIpcHandler';

import sqlServerLogo from '../../assets/img/database-logos/sql-server.png';
import mySqlLogo from '../../assets/img/database-logos/mysql.png';
import oracleLogo from '../../assets/img/database-logos/oracle.png';
import defaultDatabaseLogo from '../../assets/img/database-logos/database.png';
import TimeIndicator from '../base/TimeIndicator';

/**
 * Database info panel component.
 *  Shows the related database properties, such as name, version, and driver.
 * @since 0.5
 */
export default function DatabasePropsPanel() {
  const [dbProps, setDbProps] = useState<DatabaseProperties | null>(null);
  const [dbIllustration, setDbIllustration] =
    useState<string>(defaultDatabaseLogo);

  const { t } = useTranslation();

  const location = useLocation();
  const environmentId = location.pathname.split('/')[2];

  useEffect(() => {
    async function loadDatabaseProperties() {
      setDbProps(await getDatabaseProperties(Number(environmentId)));
    }

    loadDatabaseProperties();

    ipcRenderer.on(`environmentDataUpdated_${environmentId}`, async () => {
      loadDatabaseProperties();
    });

    return () => {
      ipcRenderer.removeAllListeners(`environmentDataUpdated_${environmentId}`);
      setDbProps(null);
    };
  }, [environmentId]);

  useEffect(() => {
    if (dbProps && dbProps.dbName) {
      const { dbName } = dbProps;
      if (dbName.toLocaleLowerCase().indexOf('mysql') > -1) {
        setDbIllustration(mySqlLogo);
      } else if (dbName.toLocaleLowerCase().indexOf('sql server') > -1) {
        setDbIllustration(sqlServerLogo);
      } else if (dbName.toLocaleLowerCase().indexOf('oracle') > -1) {
        setDbIllustration(oracleLogo);
      } else {
        setDbIllustration(defaultDatabaseLogo);
      }
    }
  }, [dbProps]);

  return (
    <div
      className="widget-container"
      style={{
        maxWidth: '22rem',
      }}
    >
      <h3 className="title">
        {t('components.SystemResources.DatabasePropsPanel.title')}
      </h3>
      <div className="card">
        {dbProps === null ? (
          <p>{t('components.global.noData')}</p>
        ) : (
          <>
            <img
              src={dbIllustration}
              style={{
                objectFit: 'contain',
                maxHeight: '150px',
                width: '100%',
              }}
              alt="Server Logo"
            />
            <div>
              <p className="font-soft mt-2">
                {t('components.SystemResources.DatabasePropsPanel.dbName')}
              </p>
              <h4>{dbProps.dbName}</h4>
              <p className="font-soft mt-1">
                {t('components.SystemResources.DatabasePropsPanel.dbVersion')}
              </p>
              <h4>{dbProps.dbVersion}</h4>
              <p className="font-soft mt-1">
                {t(
                  'components.SystemResources.DatabasePropsPanel.dbDriverName'
                )}
              </p>
              <h4>{dbProps.dbDriverName}</h4>
              <p className="font-soft mt-1">
                {t(
                  'components.SystemResources.DatabasePropsPanel.dbDriverVersion'
                )}
              </p>
              <h4 style={{ overflow: 'auto' }}>{dbProps.dbDriverVersion}</h4>
            </div>
            <div className="footer">
              <TimeIndicator date={dbProps.httpResponse.timestamp} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
