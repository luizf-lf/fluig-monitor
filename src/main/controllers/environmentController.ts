import log from 'electron-log';
import prismaClient from '../database/prismaContext';
import { Environment } from '../generated/client';

export default class EnvironmentController {
  environments: Environment[];

  constructor() {
    this.environments = [];
  }

  async getAll(includeMonitorHistory = false): Promise<Environment[]> {
    log.info(
      '[main] EnvironmentController: Querying all environments from database.'
    );
    this.environments = await prismaClient.environment.findMany({
      where: {
        logDeleted: false,
      },
      include: {
        oAuthKeysId: true,
        updateScheduleId: true,
        monitorHistory: includeMonitorHistory,
      },
    });

    return this.environments;
  }
}
