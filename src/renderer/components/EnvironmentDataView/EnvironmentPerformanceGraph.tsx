import { useTranslation } from 'react-i18next';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import SpinnerLoader from '../Loaders/Spinner';
import EnvironmentGraphTooltip from './EnvironmentGraphTooltip';
import { HTTPResponse } from '../../../main/generated/client';

interface Props {
  pings: HTTPResponse[];
}

export default function EnvironmentPerformanceGraph({ pings }: Props) {
  const { t } = useTranslation();

  if (typeof pings === 'undefined') {
    return <SpinnerLoader />;
  }

  pings.reverse();

  return (
    <div className="widget-container">
      <h3 className="title">
        {t('components.EnvironmentPerformanceGraph.title')}
      </h3>
      {pings.length === 0 ? (
        <div className="widget-card">
          {t('components.EnvironmentPerformanceGraph.insufficientOrNoData')}
        </div>
      ) : (
        <div className="widget-card" style={{ height: '55vh' }}>
          <div id="graph-title-container">
            <h3>{t('components.EnvironmentPerformanceGraph.graphTitle')}</h3>
          </div>
          <ResponsiveContainer width="100%" height="92%">
            <AreaChart data={pings}>
              <CartesianGrid strokeDasharray="3" vertical={false} />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(el: Date) =>
                  `    ${el.toLocaleTimeString()}      `
                }
                interval="preserveEnd"
              />
              <YAxis
                allowDecimals={false}
                dataKey="responseTimeMs"
                type="number"
                domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.1)]} // TODO: Round the maximum value to a multiple of 250?
                tickCount={9}
              />
              <Tooltip
                content={(content) => {
                  return <EnvironmentGraphTooltip content={content} />;
                }}
              />
              <Area
                type="monotone"
                dataKey="responseTimeMs"
                dot={false}
                stroke="var(--purple)"
                strokeWidth={2}
                fill="var(--light-purple)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
