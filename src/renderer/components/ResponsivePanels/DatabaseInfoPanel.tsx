import sqlServerLogo from '../../assets/img/database-logos/sqlserver.png';

/**
 * Database info panel component.
 *  Shows the related database information, such as name, version, and driver.
 * @since 0.5
 * // TODO: Recover data from local database
 */
export default function DatabaseInfoPanel() {
  return (
    <div className="widget-container">
      <h3 className="title">Banco De Dados</h3>
      <div className="card">
        <img
          src={sqlServerLogo}
          style={{
            objectFit: 'contain',
            maxHeight: '169px',
            width: '100%',
          }}
          alt="Sql Server Logo"
        />
        <div>
          <p className="font-soft mt-2">SGBD</p>
          <h4>Microsoft SQL Server</h4>
          <p className="font-soft mt-1">Versão</p>
          <h4>15.00.2000</h4>
          <p className="font-soft mt-1">Driver</p>
          <h4>Microsoft JDBC Driver 4.0 for SQL Server</h4>
          <p className="font-soft mt-1">Versão Do Driver</p>
          <h4>4.0.2206.100</h4>
        </div>
      </div>
    </div>
  );
}
