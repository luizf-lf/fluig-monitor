import { useEffect } from 'react';
import Box from '../base/Box';
import DefaultMotionDiv from '../base/DefaultMotionDiv';
import { getDetailedMemoryById } from '../../ipc/environmentsIpcHandler';

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
      <Box>Detailed Memory</Box>
    </DefaultMotionDiv>
  );
}

export default EnvironmentDetailedMemoryContainer;
