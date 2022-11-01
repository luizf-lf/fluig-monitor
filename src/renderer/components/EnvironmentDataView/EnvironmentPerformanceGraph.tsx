import { useTranslation } from 'react-i18next';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
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
import EnvironmentGraphTooltip from './EnvironmentGraphTooltip';

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
  // TODO: Perhaps receive the last 100 http responses alone and calculate and average, instead of receiving each of the api data responses

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
      <h3 className="title">
        {t('components.EnvironmentPerformanceGraph.title')}
      </h3>
      {graphData.length < 3 ? (
        <div className="widget-card">
          {t('components.EnvironmentPerformanceGraph.insufficientOrNoData')}
        </div>
      ) : (
        <div className="widget-card" style={{ height: '55vh' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={graphData}>
              <CartesianGrid strokeDasharray="3" vertical={false} />
              <XAxis dataKey="timestamp" display="none" />
              <YAxis
                allowDecimals={false}
                type="number"
                domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.25)]}
                tickCount={9}
              />
              <Tooltip
                content={(content) => {
                  return <EnvironmentGraphTooltip content={content} />;
                }}
              />
              <Legend
                payload={[
                  {
                    value: t(
                      'components.EnvironmentPerformanceGraph.licenseApi'
                    ),
                    color: 'var(--purple)',
                    id: 'license',
                    type: 'line',
                  },
                  {
                    value: t(
                      'components.EnvironmentPerformanceGraph.monitorApi'
                    ),
                    color: 'var(--red)',
                    id: 'monitor',
                    type: 'line',
                  },
                  {
                    value: t(
                      'components.EnvironmentPerformanceGraph.statisticsApi'
                    ),
                    color: 'var(--green)',
                    id: 'statistics',
                    type: 'line',
                  },
                ]}
              />
              <Area
                type="linear"
                dataKey="license"
                dot={false}
                stroke="var(--purple)"
                strokeWidth={2}
                fill="var(--light-purple)"
              />
              <Area
                type="linear"
                dataKey="monitor"
                dot={false}
                stroke="var(--red)"
                strokeWidth={2}
                fill="var(--light-red)"
              />
              <Area
                type="linear"
                dataKey="statistics"
                dot={false}
                stroke="var(--green)"
                strokeWidth={2}
                fill="var(--light-green)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
