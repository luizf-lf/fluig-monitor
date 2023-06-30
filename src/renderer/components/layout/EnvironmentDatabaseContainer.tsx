import DatabasePropsPanel from '../container/DatabasePropsPanel';
import DatabaseStorageGraph from '../container/DatabaseStorageGraph';
import DatabaseNetworkGraph from '../container/DatabaseNetworkGraph';
import DefaultMotionDiv from '../base/DefaultMotionDiv';

/**
 * Environment database info container. Has a 5 x 1 grid template.
 * @since 0.5
 */
export default function EnvironmentDatabaseContainer() {
  return (
    <DefaultMotionDiv id="environment-database-container">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '5fr 1fr',
          gap: '2rem',
        }}
      >
        <div>
          <DatabaseStorageGraph />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
            }}
          >
            <DatabaseNetworkGraph mode="INBOUND" />
            <DatabaseNetworkGraph mode="OUTBOUND" />
          </div>
          <DatabaseNetworkGraph mode="MIXED" />
        </div>
        <DatabasePropsPanel />
      </div>
    </DefaultMotionDiv>
  );
}
