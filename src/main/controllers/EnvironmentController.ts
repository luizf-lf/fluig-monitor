import log from 'electron-log';
import HttpResponseResourceType from '../../common/interfaces/HttpResponseResourceTypes';
import {
  EnvironmentCreateControllerInterface,
  EnvironmentServerData,
  EnvironmentServices,
  EnvironmentUpdateControllerInterface,
  EnvironmentWithDetailedMemoryHistory,
  EnvironmentWithHistory,
  EnvironmentWithRelatedData,
} from '../../common/interfaces/EnvironmentControllerInterface';
import prismaClient from '../database/prismaContext';
import { Environment, HTTPResponse } from '../generated/client';
import GAEvents from '../analytics/GAEvents';

interface ConstructorOptions {
  writeLogs: boolean;
}

export default class EnvironmentController {
  environments: EnvironmentWithRelatedData[];

  found:
    | Environment
    | EnvironmentWithHistory
    | EnvironmentWithRelatedData
    | null;

  lastHttpResponse: HTTPResponse | null;

  httpResponses: HTTPResponse[];

  created: Environment | null;

  updated: Environment | null;

  deleted: Environment | null;

  writeLogs: boolean;

  constructor(options?: ConstructorOptions) {
    this.environments = [];
    this.found = null;
    this.created = null;
    this.updated = null;
    this.deleted = null;

    this.lastHttpResponse = null;
    this.httpResponses = [];

    this.writeLogs = (options && options.writeLogs) || false;
  }

  async getAll(): Promise<EnvironmentWithRelatedData[]> {
    if (this.writeLogs) {
      log.info(
        'EnvironmentController: Querying all environments from database.'
      );
    }
    this.environments = await prismaClient.environment.findMany({
      where: {
        logDeleted: false,
      },
      include: {
        oAuthKeysId: true,
        updateScheduleId: true,
        httpResponses: {
          take: 25,
          where: {
            resourceType: HttpResponseResourceType.PING,
          },
          orderBy: {
            timestamp: 'desc',
          },
        },
      },
    });

    return this.environments;
  }

  async getById(
    id: number,
    includeRelatedData = false
  ): Promise<Environment | EnvironmentWithRelatedData | null> {
    if (this.writeLogs) {
      log.info(
        'EnvironmentController: Querying environment from database with the id',
        id,
        includeRelatedData === true ? 'with related data.' : ''
      );
    }
    this.found = await prismaClient.environment.findUnique({
      where: {
        id,
      },
      include: {
        updateScheduleId: includeRelatedData,
        oAuthKeysId: includeRelatedData,
        httpResponses: includeRelatedData
          ? {
              take: 25,
              where: {
                resourceType: HttpResponseResourceType.PING,
              },
              orderBy: {
                timestamp: 'desc',
              },
            }
          : undefined,
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
          take: 1,
          include: {
            httpResponse: true,
          },
          orderBy: {
            id: 'desc',
          },
        },
        statisticHistory: {
          take: 1,
          include: {
            httpResponse: true,
          },
          orderBy: {
            id: 'desc',
          },
        },
        monitorHistory: {
          take: 1,
          include: {
            httpResponse: true,
          },
          orderBy: {
            id: 'desc',
          },
        },
        httpResponses: {
          where: {
            timestamp: {
              gte: new Date(Date.now() - 86400000),
            },
            resourceType: {
              equals: 'PING',
            },
          },
          orderBy: {
            timestamp: 'asc',
          },
        },
      },
    });

    return this.found as EnvironmentWithHistory;
  }

  async getLastScrapeResponseById(id: number): Promise<HTTPResponse | null> {
    this.lastHttpResponse = await prismaClient.hTTPResponse.findFirst({
      where: {
        environmentId: id,
        statisticHistory: {
          isNot: null,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    return this.lastHttpResponse;
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

  async getHttpResponsesById(
    id: number,
    limit?: number
  ): Promise<HTTPResponse[]> {
    this.httpResponses = await prismaClient.hTTPResponse.findMany({
      take: limit || 1000,
      where: {
        environmentId: id,
        resourceType: HttpResponseResourceType.PING,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    return this.httpResponses;
  }

  static async getEnvironmentServerData(
    id: number
  ): Promise<EnvironmentServerData | null> {
    const serverData = await prismaClient.environment.findFirst({
      where: {
        id,
      },
      include: {
        statisticHistory: {
          take: 1,
          include: {
            httpResponse: true,
          },
          orderBy: {
            httpResponse: {
              timestamp: 'desc',
            },
          },
        },
      },
    });

    return serverData;
  }

  static async getEnvironmentServices(
    id: number
  ): Promise<EnvironmentServices | null> {
    const servicesData = await prismaClient.environment.findFirst({
      where: {
        id,
      },
      include: {
        monitorHistory: {
          take: 1,
          include: {
            httpResponse: true,
          },
          orderBy: {
            httpResponse: {
              timestamp: 'desc',
            },
          },
        },
      },
    });

    return servicesData;
  }

  async new(data: EnvironmentCreateControllerInterface): Promise<Environment> {
    if (this.writeLogs) {
      log.info(
        'EnvironmentController: Saving a new environment on the database'
      );
    }
    this.created = await prismaClient.environment.create({
      data,
    });

    return this.created;
  }

  async update(
    data: EnvironmentUpdateControllerInterface
  ): Promise<Environment> {
    if (this.writeLogs) {
      log.info('EnvironmentController: Updating environment with id', data.id);
    }
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

  async updateRelease(
    environmentId: number,
    release: string
  ): Promise<Environment | null> {
    try {
      log.info(`Updating environment ${environmentId} release`);

      this.updated = await prismaClient.environment.update({
        where: {
          id: environmentId,
        },
        data: {
          release,
        },
      });

      return this.updated;
    } catch (error) {
      log.error(`UpdateRelease error: ${error}`);
      return null;
    }
  }

  async delete(id: number): Promise<Environment> {
    const timer = Date.now();
    if (this.writeLogs) {
      log.info('Deleting environment with id', id, 'and related fields');
    }
    this.deleted = await prismaClient.environment.update({
      where: {
        id,
      },
      data: {
        logDeleted: true,
        logDeletedAt: new Date().toISOString(),
      },
    });

    GAEvents.environmentDeleted(timer, this.deleted.release, this.deleted.kind);

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

  static async getDetailedMemoryById(
    id: number
  ): Promise<EnvironmentWithDetailedMemoryHistory | null> {
    log.info(
      'EnvironmentController: Recovering detailed environment memory stats by id ',
      id
    );

    const environment = await prismaClient.environment.findFirst({
      where: {
        id,
      },
      include: {
        statisticHistory: {
          select: {
            systemServerMemorySize: true,
            systemServerMemoryFree: true,
            memoryHeap: true,
            nonMemoryHeap: true,
            detailedMemory: true,
            systemHeapMaxSize: true,
            systemHeapSize: true,
            httpResponse: true,
          },
          orderBy: {
            httpResponse: {
              timestamp: 'desc',
            },
          },
          take: 300,
        },
      },
    });

    return environment;
  }
}
