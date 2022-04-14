import AmbientDataInterface from './AmbientDataInterface';
import MonitorHistoryInterface from './MonitorHistoryInterface';

export default interface DatabaseInterface {
  userSettings: {
    theme: string;
    openOnLastServer: boolean;
  };
  ambients: AmbientDataInterface[];
  monitoringHistory: MonitorHistoryInterface[];
}
