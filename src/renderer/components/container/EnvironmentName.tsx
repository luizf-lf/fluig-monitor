import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getEnvironmentById } from '../../ipc/environmentsIpcHandler';

/**
 * Self loading environment name + version component
 * @since 0.5
 */
export default function EnvironmentName() {
  const [environmentName, setEnvironmentName] = useState('Servidor Local');
  const [release, setEnvironmentRelease] = useState('1.7.1');

  const location = useLocation();
  const environmentId = location.pathname.split('/')[2];

  useEffect(() => {
    async function loadEnvironmentName() {
      const properties = await getEnvironmentById(Number(environmentId));

      if (properties) {
        setEnvironmentName(properties.name);
        setEnvironmentRelease(properties.release);
      }
    }

    ipcRenderer.on(`environmentDataUpdated_${environmentId}`, () => {
      loadEnvironmentName();
    });

    loadEnvironmentName();

    return () => {
      ipcRenderer.removeAllListeners(`environmentDataUpdated_${environmentId}`);
      setEnvironmentName('');
      setEnvironmentRelease('');
    };
  }, [environmentId]);

  return (
    <div>
      <h2 className="title">
        {environmentName} <span className="pill">Fluig {release}</span>
      </h2>
    </div>
  );
}
