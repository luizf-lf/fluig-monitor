import { EnvironmentAuthKeys } from '../generated/client';
import prismaClient from '../database/prismaContext';
import { AuthKeysControllerInterface } from '../../common/interfaces/AuthKeysControllerInterface';

export default class AuthKeysController {
  created: EnvironmentAuthKeys | null;

  constructor() {
    this.created = null;
  }

  async new(data: AuthKeysControllerInterface): Promise<EnvironmentAuthKeys> {
    this.created = await prismaClient.environmentAuthKeys.create({
      data,
    });

    return this.created;
  }
}
