import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import {
  CartesianGrid,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { DatabaseTraffic } from '../../../main/controllers/StatisticsHistoryController';
import { getDatabaseStatisticsHistory } from '../../ipc/environmentsIpcHandler';
import GraphTooltip from '../base/GraphTooltip';
import formatBytes from '../../../common/utils/formatBytes';

interface Props {
  mode: 'INBOUND' | 'OUTBOUND' | 'MIXED';
}

/**
 * Database network graph. Can display inbound, outbound, or both data graphs;
 * @since 0.5
 */
export default function DatabaseNetworkGraph({ mode }: Props) {
  const [dbTraffic, setDbTraffic] = useState([] as DatabaseTraffic[]);
  const [graph, setGraph] = useState(<></>);
  const [graphTitle, setGraphTitle] = useState('');
  const [hasGraphData, setHasGraphData] = useState(false);
  const { t } = useTranslation();

  const location = useLocation();
  const environmentId = location.pathname.split('/')[2];

  let normalizedData = [];

  useEffect(() => {
    async function loadGraphData() {
      setDbTraffic(await getDatabaseStatisticsHistory(Number(environmentId)));
    }

    ipcRenderer.on(`environmentDataUpdated_${environmentId}`, () => {
      loadGraphData();
    });

    loadGraphData();

    return () => {
      ipcRenderer.removeAllListeners(`environmentDataUpdated_${environmentId}`);
      setDbTraffic([]);
    };
  }, [environmentId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    normalizedData = [];

    if (dbTraffic.length > 0) {
      for (let i = 0; i < dbTraffic.length; i += 1) {
        normalizedData.push({
          dbTrafficReceived: Number(dbTraffic[i].dbTraficRecieved),
          dbTrafficSent: Number(dbTraffic[i].dbTraficSent),
          timestamp: dbTraffic[i].httpResponse.timestamp,
        });
      }
    }

    if (dbTraffic.length === 0) {
      setGraph(
        <p>{t('components.DatabaseNetWorkGraph.insufficientOrNoData')}</p>
      );
    } else if (normalizedData[0].dbTrafficSent === -1) {
      setGraph(<p>{t('components.DatabaseNetWorkGraph.dataNotAllowed')}</p>);
    } else {
      setHasGraphData(true);
      setGraph(
        <ResponsiveContainer width="100%" height="92%">
          <AreaChart data={normalizedData.reverse()}>
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
              type="number"
              domain={[0, (dataMax: number) => Math.ceil(dataMax / 250) * 250]}
              tickFormatter={(el) => formatBytes(el)}
            />
            <Tooltip
              content={(content) => {
                return <GraphTooltip content={content} unit="bytes" />;
              }}
            />
            {(mode === 'OUTBOUND' || mode === 'MIXED') && (
              <Area
                type="monotone"
                dataKey="dbTrafficSent"
                dot={false}
                stroke="var(--green)"
                fill="var(--light-green)"
                strokeWidth={2}
              />
            )}
            {(mode === 'INBOUND' || mode === 'MIXED') && (
              <Area
                type="monotone"
                dataKey="dbTrafficReceived"
                dot={false}
                stroke="var(--yellow)"
                fill="var(--light-yellow)"
                strokeWidth={2}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    if (mode === 'INBOUND') {
      setGraphTitle(t('components.DatabaseNetWorkGraph.graphTitleInbound'));
    } else if (mode === 'OUTBOUND') {
      setGraphTitle(t('components.DatabaseNetWorkGraph.graphTitleOutbound'));
    } else {
      setGraphTitle(t('components.DatabaseNetWorkGraph.graphTitleMixed'));
    }
  }, [dbTraffic, mode, t]);

  return (
    <div className="widget-container">
      <h3 className="title">{t('components.DatabaseNetWorkGraph.title')}</h3>
      {hasGraphData ? (
        <div className="card" style={{ height: '30vh' }}>
          <h3 className="title">{graphTitle}</h3>
          {graph}
        </div>
      ) : (
        <div className="card">{graph}</div>
      )}
    </div>
  );
}
