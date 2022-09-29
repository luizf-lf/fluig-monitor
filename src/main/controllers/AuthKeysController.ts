import log from 'electron-log';
import { EnvironmentAuthKeys } from '../generated/client';
import prismaClient from '../database/prismaContext';
import { AuthKeysControllerInterface } from '../../common/interfaces/AuthKeysControllerInterface';

export default class AuthKeysController {
  created: EnvironmentAuthKeys | null;

  constructor() {
    this.created = null;
  }

  async new(data: AuthKeysControllerInterface): Promise<EnvironmentAuthKeys> {
    log.info('AuthKeysController: Creating a new environment auth keys.');
    this.created = await prismaClient.environmentAuthKeys.create({
      data,
    });

    return this.created;
  }
}
