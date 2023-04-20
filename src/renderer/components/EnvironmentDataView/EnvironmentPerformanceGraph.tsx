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
import GraphTooltip from '../GraphTooltip';
import { HTTPResponse } from '../../../main/generated/client';

interface Props {
  pings: HTTPResponse[];
}

// TODO: Update to the self loading strategy

export default function EnvironmentPerformanceGraph({ pings }: Props) {
  const { t } = useTranslation();

  if (typeof pings === 'undefined') {
    return <SpinnerLoader />;
  }

  const lastPing = pings[pings.length - 1];

  return (
    <div className="widget-container">
      <h3 className="title">
        {t('components.EnvironmentPerformanceGraph.title')}
      </h3>
      {pings.length < 2 ? (
        <div className="widget-card">
          {t('components.EnvironmentPerformanceGraph.insufficientOrNoData')}
        </div>
      ) : (
        <div className="widget-card" style={{ height: '55vh' }}>
          <div id="graph-title-container">
            <h3>
              {t('components.EnvironmentPerformanceGraph.graphTitle')}
              <small
                className="font-soft font-sm"
                style={{ marginLeft: '0.5rem' }}
              >
                {t('components.EnvironmentPerformanceGraph.last24h')}
              </small>
            </h3>
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
                domain={[
                  0,
                  (dataMax: number) => Math.ceil(dataMax / 250) * 250,
                ]}
                tickCount={9}
              />
              <Tooltip
                content={(content) => {
                  return <GraphTooltip content={content} unit="ms" />;
                }}
              />
              <Area
                type={pings.length <= 200 ? 'monotone' : 'linear'}
                dataKey="responseTimeMs"
                dot={false}
                stroke={
                  lastPing.responseTimeMs === 0 ? 'var(--red)' : 'var(--purple)'
                }
                strokeWidth={2}
                fill={
                  lastPing.responseTimeMs === 0
                    ? 'var(--light-red)'
                    : 'var(--light-purple)'
                }
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
