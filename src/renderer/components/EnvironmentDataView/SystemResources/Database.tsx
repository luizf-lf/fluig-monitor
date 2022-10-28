import { FiDatabase } from 'react-icons/fi';

export default function Database() {
  return (
    <div className="card system-resource-card">
      <div className="header">
        <div className="icon-dot yellow-variant">
          <FiDatabase />
        </div>
        <span className="text-yellow">
          {/* {t('components.SystemResources.Disk.title')} */}
          Banco De Dados
        </span>
      </div>
      <div className="body">
        <p className="font-soft">
          {/* {t('components.SystemResources.Disk.used')} */}
          Tamanho
        </p>
        <h3>
          {/* {formatBytes(
        Number(diskInfo[0].systemServerHDSize) -
          Number(diskInfo[0].systemServerHDFree)
      )} */}
          62,1 GB
        </h3>
      </div>
      <div className="footer">
        <p className="font-soft font-sm">
          {/* {t('components.SystemResources.Disk.used')} */}
          Tráfego não permitido.
        </p>
      </div>
    </div>
  );
}
