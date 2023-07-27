import { useEffect, useState } from 'react';

import Box from '../base/Box';
import Stat from '../base/Stat';
import DefaultMotionDiv from '../base/DefaultMotionDiv';
import { getDetailedMemoryById } from '../../ipc/environmentsIpcHandler';
import {
  DetailedMemoryHistory,
  EnvironmentWithDetailedMemoryHistory,
} from '../../../common/interfaces/EnvironmentControllerInterface';
import SpinnerLoader from '../base/Loaders/Spinner';
import formatBytes from 'common/utils/formatBytes';
import { useTranslation } from 'react-i18next';

function EnvironmentDetailedMemoryContainer() {
  const environmentId = window.location.hash.split('/')[2];
  const [environmentData, setEnvironmentData] =
    useState<EnvironmentWithDetailedMemoryHistory | null>(null);
  const [lastMemoryData, setLastMemoryData] =
    useState<DetailedMemoryHistory | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    async function getData() {
      const environmentDataResult = await getDetailedMemoryById(
        Number(environmentId)
      );
      setEnvironmentData(environmentDataResult);

      if (environmentDataResult) {
        setLastMemoryData(environmentDataResult.statisticHistory[0]);
      }
    }

    if (environmentId) {
      getData();
    }
  }, []);

  if (!environmentData || !lastMemoryData) {
    return <SpinnerLoader />;
  }

  // TODO: Implement graph
  // TODO: Implement i18n
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
            minHeight: '16rem',
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
          <div>Gráfico vem agui</div>
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
