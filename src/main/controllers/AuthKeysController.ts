import log from 'electron-log';
import { EnvironmentAuthKeys } from '../generated/client';
import prismaClient from '../database/prismaContext';
import { AuthKeysControllerInterface } from '../../common/interfaces/AuthKeysControllerInterface';

export default class AuthKeysController {
  created: EnvironmentAuthKeys | null;

  updated: EnvironmentAuthKeys | null;

  constructor() {
    this.created = null;
    this.updated = null;
  }

  async new(data: AuthKeysControllerInterface): Promise<EnvironmentAuthKeys> {
    log.info('AuthKeysController: Creating a new environment auth keys.');
    this.created = await prismaClient.environmentAuthKeys.create({
      data,
    });

    return this.created;
  }

  async update(
    data: AuthKeysControllerInterface
  ): Promise<EnvironmentAuthKeys> {
    log.info('AuthKeysController: Updating environment auth keys.');

    this.updated = await prismaClient.environmentAuthKeys.update({
      where: {
        id: data.environmentId,
      },
      data,
    });

    return this.updated;
  }
}
