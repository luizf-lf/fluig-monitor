import prismaClient from '../database/prismaContext';
import { Log } from '../generated/client';

interface LogCreateControllerInterface {
  type: string;
  message: string;
  timestamp?: Date;
}

export default class LogController {
  created: Log | null;

  constructor() {
    this.created = null;
  }

  async writeLog(data: LogCreateControllerInterface): Promise<Log> {
    this.created = await prismaClient.log.create({ data });

    return this.created;
  }
}
