import log from 'electron-log';
import EnvironmentController from '../controllers/EnvironmentController';

async function executePing(environmentId: number): Promise<void> {
  //
}

export default async function dispatchEnvironmentPingJobs() {
  log.info('dispatchEnvironmentPingJobs: Executing environment ping job');

  const environmentList = await new EnvironmentController().getAll();
  const frequenciesMap = {
    '15s': 15000,
    '30s': 30000,
  };

  if (environmentList.length > 0) {
    for (let i = 0; i < environmentList.length; i += 1) {
      const environmentItem = environmentList[i];

      console.log(environmentItem.updateScheduleId);
      if (environmentItem.updateScheduleId) {
        setTimeout(async () => {
          await executePing(environmentItem.id);
        }, 15000);
      }
    }
  }
}
