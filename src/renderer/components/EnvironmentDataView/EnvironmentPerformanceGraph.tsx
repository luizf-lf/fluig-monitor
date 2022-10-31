import { useTranslation } from 'react-i18next';
import {
  CartesianGrid,
  // Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  LicenseHistoryWithHttpResponse,
  MonitorHistoryWithHttpResponse,
  StatisticsHistoryWithHttpResponse,
} from '../../../common/interfaces/EnvironmentControllerInterface';
import SpinnerLoader from '../Loaders/Spinner';

interface Props {
  licenses: LicenseHistoryWithHttpResponse[];
  statistics: StatisticsHistoryWithHttpResponse[];
  monitor: MonitorHistoryWithHttpResponse[];
}

interface GraphData {
  timestamp: Date;
  license: number;
  monitor: number;
  statistics: number;
}

export default function EnvironmentPerformanceGraph({
  licenses,
  statistics,
  monitor,
}: Props) {
  const graphData = [] as GraphData[];

  const { t } = useTranslation();

  if (
    typeof licenses === 'undefined' ||
    typeof statistics === 'undefined' ||
    typeof monitor === 'undefined'
  ) {
    return <SpinnerLoader />;
  }

  for (let i = 0; i < licenses.length; i += 1) {
    const timestampAverage =
      (licenses[i].httpResponse.timestamp.getTime() +
        statistics[i].httpResponse.timestamp.getTime() +
        monitor[i].httpResponse.timestamp.getTime()) /
      3;

    graphData.push({
      timestamp: new Date(timestampAverage),
      license: licenses[i].httpResponse.responseTimeMs,
      statistics: statistics[i].httpResponse.responseTimeMs,
      monitor: monitor[i].httpResponse.responseTimeMs,
    });
  }

  graphData.reverse();

  return (
    <div className="widget-container">
      <h3 className="title">Performance</h3>
      {graphData.length < 3 ? (
        <div className="widget-card">Sem dados ou dados insuficientes</div>
      ) : (
        <div className="widget-card" style={{ height: '55vh' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="timestamp" display="none" />
              <YAxis
                allowDecimals={false}
                // label="Tempo De Resposta (ms)"
              />
              <Tooltip />
              {/* <Legend /> */}
              <Line
                type="linear"
                dataKey="license"
                dot={false}
                stroke="var(--purple)"
                strokeWidth={2}
              />
              <Line
                type="linear"
                dataKey="monitor"
                dot={false}
                stroke="var(--red)"
                strokeWidth={2}
              />
              <Line
                type="linear"
                dataKey="statistics"
                dot={false}
                stroke="var(--green)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
