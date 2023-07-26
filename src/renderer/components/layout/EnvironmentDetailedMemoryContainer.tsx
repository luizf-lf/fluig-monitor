import { useEffect } from 'react';
import Box from '../base/Box';
import DefaultMotionDiv from '../base/DefaultMotionDiv';
import { getDetailedMemoryById } from '../../ipc/environmentsIpcHandler';
import Stat from '../base/Stat';

function EnvironmentDetailedMemoryContainer() {
  const environmentId = window.location.hash.split('/')[2];

  useEffect(() => {
    async function getData() {
      // TODO: Display the data on the page
      console.log(await getDetailedMemoryById(Number(environmentId)));
    }

    if (environmentId) {
      getData();
    }
  }, []);

  return (
    <DefaultMotionDiv id="environment-detailed-memory">
      <h3>Consumo de memória</h3>
      <Box>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr' }}>
          <Stat heading="3,4 GB" prefix="Usado" suffix="de 8 GB" />
          <div>Gráfico vem agui</div>
        </div>
      </Box>
      <h3>Estatísticas detalhadas</h3>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Box>Detailed Memory</Box>
        <Box>Detailed Memory</Box>
        <Box>Detailed Memory</Box>
        <Box>Detailed Memory</Box>
      </div>
    </DefaultMotionDiv>
  );
}

export default EnvironmentDetailedMemoryContainer;
