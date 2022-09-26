import log from 'electron-log';
import prismaClient from './prismaContext';

export async function getAllEnvironments() {
  log.info('Querying all environments from database.');
  const environments = await prismaClient.environment.findMany({
    where: {
      logDeleted: false,
    },
  });

  return environments;
}

export async function getEnvironmentByUUID(uuid: string) {
  log.info('Querying environment from database with the uuid', uuid);
  const environmentData = await prismaClient.environment.findUnique({
    where: {
      id: uuid,
    },
  });

  return environmentData;
}
