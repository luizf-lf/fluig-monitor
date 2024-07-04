/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
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

import Box from '../base/Box';
import Stat from '../base/Stat';
import DefaultMotionDiv from '../base/DefaultMotionDiv';
import { getDetailedMemoryById } from '../../ipc/environmentsIpcHandler';
import {
  DetailedMemoryHistory,
  EnvironmentWithDetailedMemoryHistory,
} from '../../../common/interfaces/EnvironmentControllerInterface';
import SpinnerLoader from '../base/Loaders/Spinner';
import formatBytes from '../../../common/utils/formatBytes';
import GraphTooltip from '../base/GraphTooltip';
import { GAEventsIPC } from '../../ipc/analyticsIpcHandler';

interface NormalizedMemoryData {
  timestamp: Date;
  systemServerMemorySize: number;
  systemServerMemoryFree: number;
  systemServerMemoryUsed: number;
}

function EnvironmentDetailedMemoryContainer() {
  const environmentId = window.location.hash.split('/')[2];
  const [environmentData, setEnvironmentData] =
    useState<EnvironmentWithDetailedMemoryHistory | null>(null);
  const [lastMemoryData, setLastMemoryData] =
    useState<DetailedMemoryHistory | null>(null);
  const [normalizedMemoryData, setNormalizedMemoryData] = useState<
    NormalizedMemoryData[]
  >([]);

  const { t } = useTranslation();

  useEffect(() => {
    async function getData() {
      const environmentDataResult = await getDetailedMemoryById(
        Number(environmentId)
      );
      setEnvironmentData(environmentDataResult);

      if (environmentDataResult) {
        setLastMemoryData(environmentDataResult.statisticHistory[0]);

        const dataNormalized = [];

        for (
          let i = 0;
          i < environmentDataResult.statisticHistory.length;
          i += 1
        ) {
          const element = environmentDataResult.statisticHistory[i];
          if (
            element.systemServerMemorySize &&
            element.systemServerMemoryFree
          ) {
            dataNormalized.push({
              timestamp: element.httpResponse.timestamp,
              systemServerMemorySize: Number(element.systemServerMemorySize),
              systemServerMemoryFree: Number(element.systemServerMemoryFree),
              systemServerMemoryUsed: Number(
                element.systemServerMemorySize - element.systemServerMemoryFree
              ),
            });
          }
        }

        setNormalizedMemoryData(dataNormalized);
      }
    }

    if (environmentId) {
      getData();
    }

    const timer = Date.now();
    return () => {
      GAEventsIPC.pageView(
        'environment_detailed_memory',
        'Environment Detailed Memory',
        timer
      );
    };
  }, []);

  if (!environmentData || !lastMemoryData) {
    return <SpinnerLoader />;
  }

  return (
    <DefaultMotionDiv id="environment-detailed-memory">
      <h3>
        {t(
          'components.EnvironmentDetailedMemoryContainer.memoryConsumptionTitle'
        )}
      </h3>
      <Box>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 5fr',
            minHeight: '20rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              height: '100%',
              alignItems: 'center',
            }}
          >
            <Stat
              heading={formatBytes(
                Number(lastMemoryData.systemServerMemorySize) -
                  Number(lastMemoryData.systemServerMemoryFree)
              )}
              prefix={t(
                'components.EnvironmentDetailedMemoryContainer.memoryConsumptionUsed'
              )}
              suffix={formatBytes(
                Number(lastMemoryData.systemServerMemorySize)
              )}
            />
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={normalizedMemoryData.reverse()}>
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
                dataKey="systemServerMemorySize"
                type="number"
                domain={[
                  0,
                  (dataMax: number) => Math.ceil(dataMax / 250) * 250,
                ]}
                tickFormatter={(el) => formatBytes(el)}
              />
              <Tooltip
                content={(content) => {
                  return <GraphTooltip content={content} unit="bytes" />;
                }}
              />
              <Area
                type="monotone"
                dataKey="systemServerMemoryUsed"
                dot={false}
                stroke="var(--purple)"
                strokeWidth={2}
                fill="var(--light-purple)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Box>
      <h3 style={{ marginTop: '2rem' }}>
        {t(
          'components.EnvironmentDetailedMemoryContainer.memoryStatisticsTitle'
        )}
      </h3>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Box>
          <Stat
            prefix="Memory Heap"
            heading={formatBytes(Number(lastMemoryData.memoryHeap))}
          />
        </Box>
        <Box>
          <Stat
            prefix="Non Memory Heap"
            heading={formatBytes(Number(lastMemoryData.nonMemoryHeap))}
          />
        </Box>
        <Box>
          <Stat
            prefix="System Heap Max Size"
            heading={formatBytes(Number(lastMemoryData.systemHeapMaxSize))}
          />
        </Box>
        <Box>
          <Stat
            prefix="System Heap Size"
            heading={formatBytes(Number(lastMemoryData.systemHeapSize))}
          />
        </Box>
      </div>
    </DefaultMotionDiv>
  );
}

export default EnvironmentDetailedMemoryContainer;
