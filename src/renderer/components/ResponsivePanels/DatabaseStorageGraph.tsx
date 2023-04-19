import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from 'recharts';
import { useTranslation } from 'react-i18next';

import EnvironmentGraphTooltip from '../EnvironmentDataView/EnvironmentGraphTooltip';
import { DbStatistic } from '../../../main/controllers/StatisticsHistoryController';
import formatBytes from '../../../common/utils/formatBytes';
import { getDatabaseStatisticsHistory } from '../../ipc/environmentsIpcHandler';

export interface NormalizedDbStatistic {
  dbTrafficReceived: number;
  dbTrafficSent: number;
  dbSize: number;
  timestamp: number;
}

/**
 * Database size evolution graph.
 * @since 0.5
 */
export default function DatabaseStorageGraph() {
  const [dbStatistics, setDbStatistics] = useState([] as DbStatistic[]);
  const [graph, setGraph] = useState(<></>);
  const { t } = useTranslation();

  const location = useLocation();
  const environmentId = location.pathname.split('/')[2];

  let normalizedDbStatistics = [];

  useEffect(() => {
    async function loadGraphData() {
      setDbStatistics(
        await getDatabaseStatisticsHistory(Number(environmentId))
      );
    }

    loadGraphData();
  }, [environmentId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    normalizedDbStatistics = [];

    if (dbStatistics.length > 0) {
      for (let i = 0; i < dbStatistics.length; i += 1) {
        normalizedDbStatistics.push({
          dbTrafficReceived: Number(dbStatistics[i].dbTraficRecieved),
          dbTrafficSent: Number(dbStatistics[i].dbTraficSent),
          dbSize: Number(dbStatistics[i].dbSize),
          timestamp: dbStatistics[i].httpResponse.timestamp,
        });
      }
    }

    setGraph(
      dbStatistics.length === 0 ? (
        <p>
          {t('components.EnvironmentPerformanceGraph.insufficientOrNoData')}
        </p>
      ) : (
        <ResponsiveContainer width="100%" height="92%">
          <AreaChart data={normalizedDbStatistics.reverse()}>
            <CartesianGrid strokeDasharray="3" vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(el) =>
                `    ${new Date(el).toLocaleString()}      `
              }
              interval="preserveEnd"
            />
            <YAxis
              allowDecimals={false}
              dataKey="dbSize"
              type="number"
              domain={[0, (dataMax: number) => Math.ceil(dataMax / 250) * 250]}
              tickFormatter={(el) => formatBytes(el)}
            />
            <Tooltip
              content={(content) => {
                return (
                  <EnvironmentGraphTooltip content={content} unit="bytes" />
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="dbSize"
              dot={false}
              stroke="var(--purple)"
              strokeWidth={2}
              fill="var(--light-purple)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )
    );
  }, [dbStatistics, t]);

  return (
    <div className="widget-container">
      <h3 className="title">{t('components.DatabaseEvolutionGraph.title')}</h3>
      <div className="card" style={{ height: '30vh' }}>
        <h3 className="title">
          {t('components.DatabaseEvolutionGraph.graphTitle')}
        </h3>
        {graph}
      </div>
    </div>
  );
}
