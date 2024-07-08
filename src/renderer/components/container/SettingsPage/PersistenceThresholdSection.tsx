import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiDatabase } from 'react-icons/fi';

import DefaultMotionDiv from '../../base/DefaultMotionDiv';
import {
  getAppSettingsAsObject,
  updateAppSettings,
} from '../../../ipc/settingsIpcHandler';

export default function PersistenceThresholdSection() {
  // TODO: Finish implementation
  const { t } = useTranslation();
  const [persistenceThreshold, setPersistenceThreshold] = useState(0);
  const handlePersistenceThresholdChange = (value: string) => {
    updateAppSettings([
      {
        settingId: 'PERSISTENCE_THRESHOLD',
        value,
      },
    ]);
  };

  const loadSettings = async () => {
    const { PERSISTENCE_THRESHOLD } = await getAppSettingsAsObject();
    setPersistenceThreshold(Number(PERSISTENCE_THRESHOLD.value || 0));
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <DefaultMotionDiv id="persistence-threshold-settings">
      <h3 className="icon-title">
        <span className="icon-dot green-variant">
          <FiDatabase />
        </span>
        Persistência de dados
      </h3>
      <p className="mb-2">
        Utilize esta opção para definir o limite em dias, para a persistência
        dos dados dos ambientes monitorados pelo Fluig Monitor.
      </p>

      <div className="form-group mt-2">
        <label htmlFor="persistenceThreshold">
          Limite de persistência de dados (dias):
          <input
            id="persistenceThreshold"
            name="persistenceThreshold"
            className="form-input ml-1"
            type="number"
            min="0"
            defaultValue={persistenceThreshold}
            onChange={(event) =>
              handlePersistenceThresholdChange(event.target.value)
            }
          />
        </label>

        <small className="font-soft">
          Dados anteriores ao limite de persistência de dados serão excluídos.
          Deixe em branco ou como &quot;0&quot; para desativar esta opção.
        </small>
      </div>
    </DefaultMotionDiv>
  );
}
