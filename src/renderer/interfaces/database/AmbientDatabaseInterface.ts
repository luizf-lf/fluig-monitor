import AmbientDataInterface from '../AmbientDataInterface';
import MonitorHistoryInterface from '../MonitorHistoryInterface';

export default interface AmbientDatabaseInterface {
  ambients: AmbientDataInterface[];
  monitoringHistory: MonitorHistoryInterface[];
}
