import EnvironmentDataInterface from '../EnvironmentDataInterface';
import MonitorHistoryInterface from '../MonitorHistoryInterface';

export default interface EnvironmentDatabaseInterface {
  environments: EnvironmentDataInterface[];
  monitoringHistory: MonitorHistoryInterface[];
}
