import { useEffect, useState } from 'react';
import { FiActivity, FiWifi, FiWifiOff } from 'react-icons/fi';
import { HTTPResponse } from '../../../main/generated/client';
import { getLastHttpResponseById } from '../../ipc/environmentsIpcHandler';

import '../../assets/styles/components/EnvironmentDataView/EnvironmentStatusCard.scss';

interface Props {
  environmentId: number;
}

export default function EnvironmentStatusCard({ environmentId }: Props) {
  const [lastHttpResponse, setLastHttpResponse] = useState({} as HTTPResponse);

  useEffect(() => {
    async function getData() {
      setLastHttpResponse(await getLastHttpResponseById(environmentId));
    }

    getData();
  }, [environmentId]);

  let statusBody = <></>;

  // TODO: Add i18n
  if (lastHttpResponse.statusCode !== 0) {
    if (lastHttpResponse.responseTimeMs > 1000) {
      statusBody = (
        <>
          <div className="status-message">
            <h3 className="text-yellow">Atenção</h3>
            <span className="text-secondary">
              O servidor está online, porém apresenta um tempo de resposta
              incomum.
            </span>
          </div>
          <div className="status-icon has-warning">
            <FiWifi />
          </div>
        </>
      );
    } else {
      statusBody = (
        <>
          <div className="status-message">
            <h3 className="text-green">Operacional</h3>
            <span className="text-secondary ">
              O servidor está online, e operando corretamente.
            </span>
          </div>
          <div className="status-icon breathe">
            <FiWifi />
          </div>
        </>
      );
    }
  } else {
    statusBody = (
      <>
        <div className="status-message">
          <h3 className="text-red">Indisponível</h3>
          <span className="text-secondary">
            É possível que o ambiente esteja offline. Veja detalhes abaixo:
          </span>
        </div>
        <div className="status-icon has-danger">
          <FiWifiOff />
        </div>
      </>
    );
  }

  return (
    <div className="card environment-status-card">
      <div className="header">
        <div className="icon-dot red-variant">
          <FiActivity />
        </div>
        <span className="text-red">Status</span>
      </div>
      <div className="body">{statusBody}</div>
      <div className="footer">
        {lastHttpResponse.statusCode !== 0 ? (
          <span>Tempo De Resposta: {lastHttpResponse.responseTimeMs}ms</span>
        ) : (
          <span className="text-red">{lastHttpResponse.statusMessage}</span>
        )}
      </div>
    </div>
  );
}
