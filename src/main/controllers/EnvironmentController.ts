import log from 'electron-log';
import {
  EnvironmentCreateControllerInterface,
  EnvironmentUpdateControllerInterface,
  EnvironmentWithHistory,
  EnvironmentWithRelatedData,
} from '../../common/interfaces/EnvironmentControllerInterface';
import prismaClient from '../database/prismaContext';
import { Environment, HTTPResponse } from '../generated/client';

export default class EnvironmentController {
  environments: EnvironmentWithRelatedData[];

  found:
    | Environment
    | EnvironmentWithHistory
    | EnvironmentWithRelatedData
    | null;

  lastHttpResponse: HTTPResponse | null;

  created: Environment | null;

  updated: Environment | null;

  deleted: Environment | null;

  constructor() {
    this.environments = [];
    this.found = null;
    this.created = null;
    this.updated = null;
    this.deleted = null;

    this.lastHttpResponse = null;
  }

  async getAll(): Promise<EnvironmentWithRelatedData[]> {
    log.info('EnvironmentController: Querying all environments from database.');
    this.environments = await prismaClient.environment.findMany({
      where: {
        logDeleted: false,
      },
      include: {
        oAuthKeysId: true,
        updateScheduleId: true,
      },
    });

    return this.environments;
  }

  async getById(
    id: number,
    includeRelatedData = false
  ): Promise<Environment | EnvironmentWithRelatedData | null> {
    log.info(
      'EnvironmentController: Querying environment from database with the id',
      id,
      includeRelatedData === true ? 'with related data.' : ''
    );
    this.found = await prismaClient.environment.findUnique({
      where: {
        id,
      },
      include: {
        updateScheduleId: includeRelatedData,
        oAuthKeysId: includeRelatedData,
      },
    });

    return includeRelatedData
      ? (this.found as EnvironmentWithRelatedData)
      : this.found;
  }

  async getHistoryById(id: number): Promise<EnvironmentWithHistory | null> {
    this.found = await prismaClient.environment.findUnique({
      where: {
        id,
      },
      include: {
        licenseHistory: {
          take: 100,
          include: {
            httpResponse: true,
          },
          orderBy: {
            id: 'desc',
          },
        },
        statisticHistory: {
          take: 100,
          include: {
            httpResponse: true,
          },
          orderBy: {
            id: 'desc',
          },
        },
        monitorHistory: {
          take: 100,
          include: {
            httpResponse: true,
          },
          orderBy: {
            id: 'desc',
          },
        },
      },
    });

    return this.found as EnvironmentWithHistory;
  }

  async getLastHttpResponseById(
    id: number,
    onlySuccessful = false
  ): Promise<HTTPResponse | null> {
    this.lastHttpResponse = await prismaClient.hTTPResponse.findFirst({
      where: {
        environmentId: id,
        statusCode: onlySuccessful ? 200 : undefined,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    return this.lastHttpResponse;
  }

  async new(data: EnvironmentCreateControllerInterface): Promise<Environment> {
    log.info('EnvironmentController: Saving a new environment on the database');
    this.created = await prismaClient.environment.create({
      data,
    });

    return this.created;
  }

  async update(
    data: EnvironmentUpdateControllerInterface
  ): Promise<Environment> {
    log.info('EnvironmentController: Updating environment with id', data.id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedData: any = {};

    if (data.name) updatedData.name = data.name;
    if (data.release) updatedData.release = data.release;
    if (data.baseUrl) updatedData.baseUrl = data.baseUrl;
    if (data.kind) updatedData.kind = data.kind;

    updatedData.logUpdateAt = new Date().toISOString();

    this.updated = await prismaClient.environment.update({
      where: {
        id: data.id,
      },
      data: updatedData,
    });

    return this.updated;
  }

  async delete(id: number): Promise<Environment> {
    log.info('Deleting environment with id', id, 'and related fields');
    this.deleted = await prismaClient.environment.update({
      where: {
        id,
      },
      data: {
        logDeleted: true,
        logDeletedAt: new Date().toISOString(),
      },
    });

    return this.deleted;
  }

  static async toggleFavorite(
    id: number
  ): Promise<{ favorited: boolean; exception: string | null }> {
    log.info('Togging environment favorite for environment with id', id);

    const totalFavorited = await prismaClient.environment.count({
      where: {
        isFavorite: true,
      },
    });

    const environment = await prismaClient.environment.findUnique({
      where: {
        id,
      },
    });

    if (environment === null) {
      log.error('Environment ', id, 'doest not exists on the database');
      return { favorited: false, exception: null };
    }

    if (totalFavorited >= 3 && !environment.isFavorite) {
      return { favorited: false, exception: 'MAX_FAVORITES_EXCEEDED' };
    }

    await prismaClient.environment.update({
      where: {
        id,
      },
      data: {
        isFavorite: !environment.isFavorite,
        favoritedAt: new Date().toISOString(),
      },
    });

    return { favorited: !environment.isFavorite, exception: null };
  }
}
