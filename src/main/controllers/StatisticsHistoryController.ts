import prismaClient from '../database/prismaContext';
import { HTTPResponse, StatisticsHistory } from '../generated/client';
import HttpResponseController from './HttpResponseController';
import HttpResponseResourceType from '../../common/interfaces/HttpResponseResourceTypes';

interface CreateStatisticHistoryProps {
  environmentId: number;

  statusCode: number;
  statusMessage: string;
  endpoint: string;
  timestamp: string;
  responseTimeMs: number;

  dataSourceFluigDs: string;
  dataSourceFluigDsRo: string;
  dbName: string;
  dbVersion: string;
  dbDriverName: string;
  dbDriverVersion: string;
  connectedUsers: number;
  memoryHeap: number;
  nonMemoryHeap: number;
  dbTraficRecieved: number;
  dbTraficSent: number;
  dbSize: number;
  artifactsApps: string;
  artifactsCore: string;
  artifactsSystem: string;
  externalConverter: boolean;
  runtimeStart: string;
  runtimeUptime: number;
  threadingCount: number;
  threadingPeakCount: number;
  threadingDaemonCount: number;
  threadingTotalStarted: number;
  detailedMemory: string;
  systemServerMemorySize: number | null;
  systemServerMemoryFree: number | null;
  systemServerHDSize: string | null;
  systemServerHDFree: string | null;
  systemServerCoreCount: number | null;
  systemServerArch: string | null;
  systemTmpFolderSize: number | null;
  systemLogFolderSize: number | null;
  systemHeapMaxSize: number | null;
  systemHeapSize: number | null;
  systemUptime: number | null;
}

export interface HDStats {
  systemServerHDFree: string | null;
  systemServerHDSize: string | null;
  httpResponse: HTTPResponse;
}

export interface MemoryStats {
  systemServerMemorySize: bigint | null;
  systemServerMemoryFree: bigint | null;
  httpResponse: HTTPResponse;
}

export interface DbStatistic {
  dbTraficRecieved: bigint | null;
  dbTraficSent: bigint | null;
  dbSize: bigint | null;
  httpResponse: HTTPResponse;
}

export interface DatabaseProperties {
  dbName: string | null;
  dbVersion: string | null;
  dbDriverName: string | null;
  dbDriverVersion: string | null;
  httpResponse: HTTPResponse;
}

export default class StatisticsHistoryController {
  created: StatisticsHistory | null;

  constructor() {
    this.created = null;
  }

  async new(data: CreateStatisticHistoryProps): Promise<StatisticsHistory> {
    const httpResponse = await new HttpResponseController().new({
      environmentId: data.environmentId,
      statusCode: data.statusCode,
      statusMessage: data.statusMessage,
      endpoint: data.endpoint,
      resourceType: HttpResponseResourceType.STATISTICS,
      timestamp: data.timestamp,
      responseTimeMs: data.responseTimeMs,
    });

    this.created = await prismaClient.statisticsHistory.create({
      data: {
        environmentId: data.environmentId,
        httpResponseId: httpResponse.id,

        dataSourceFluigDs: data.dataSourceFluigDs,
        dataSourceFluigDsRo: data.dataSourceFluigDsRo,
        dbName: data.dbName,
        dbVersion: data.dbVersion,
        dbDriverName: data.dbDriverName,
        dbDriverVersion: data.dbDriverVersion,
        connectedUsers: data.connectedUsers,
        memoryHeap: data.memoryHeap,
        nonMemoryHeap: data.nonMemoryHeap,
        dbTraficRecieved: data.dbTraficRecieved,
        dbTraficSent: data.dbTraficSent,
        dbSize: data.dbSize,
        artifactsApps: data.artifactsApps,
        artifactsCore: data.artifactsCore,
        artifactsSystem: data.artifactsSystem,
        externalConverter: data.externalConverter,
        runtimeStart: new Date(data.runtimeStart).toISOString(),
        runtimeUptime: data.runtimeUptime,
        threadingCount: data.threadingCount,
        threadingPeakCount: data.threadingPeakCount,
        threadingDaemonCount: data.threadingDaemonCount,
        threadingTotalStarted: data.threadingTotalStarted,
        detailedMemory: data.detailedMemory,
        systemServerMemorySize: data.systemServerMemorySize,
        systemServerMemoryFree: data.systemServerMemoryFree,
        systemServerHDSize: data.systemServerHDSize,
        systemServerHDFree: data.systemServerHDFree,
        systemServerCoreCount: data.systemServerCoreCount,
        systemServerArch: data.systemServerArch,
        systemTmpFolderSize: data.systemTmpFolderSize,
        systemLogFolderSize: data.systemLogFolderSize,
        systemHeapMaxSize: data.systemHeapMaxSize,
        systemHeapSize: data.systemHeapSize,
        systemUptime: data.systemUptime,
      },
    });

    return this.created;
  }

  static async getDiskInfo(id: number): Promise<HDStats[]> {
    const stats = await prismaClient.statisticsHistory.findMany({
      select: {
        systemServerHDFree: true,
        systemServerHDSize: true,
        httpResponse: true,
      },
      take: 1,
      orderBy: {
        httpResponse: {
          timestamp: 'desc',
        },
      },
      where: {
        environmentId: id,
      },
    });

    return stats;
  }

  static async getMemoryInfo(id: number): Promise<MemoryStats[]> {
    const stats = await prismaClient.statisticsHistory.findMany({
      select: {
        systemServerMemorySize: true,
        systemServerMemoryFree: true,
        httpResponse: true,
      },
      take: 1,
      orderBy: {
        httpResponse: {
          timestamp: 'desc',
        },
      },
      where: {
        environmentId: id,
      },
    });

    return stats;
  }

  /**
   * Recovers the database info as an array.
   * @deprecated in favor of new methods (getDatabaseStatisticsHistory and getLastDatabaseStatistic)
   */
  static async getDatabaseInfo(id: number): Promise<DbStatistic[]> {
    const stats = await prismaClient.statisticsHistory.findMany({
      select: {
        dbTraficRecieved: true,
        dbTraficSent: true,
        dbSize: true,
        httpResponse: true,
      },
      take: 1,
      orderBy: {
        httpResponse: {
          timestamp: 'desc',
        },
      },
      where: {
        environmentId: id,
      },
    });

    return stats;
  }

  /**
   * Gets the latest database properties from the statistics history.
   * @since 0.5
   */
  static async getDatabaseProperties(
    id: number
  ): Promise<DatabaseProperties | null> {
    const props = await prismaClient.statisticsHistory.findFirst({
      select: {
        dbName: true,
        dbVersion: true,
        dbDriverName: true,
        dbDriverVersion: true,
        httpResponse: true,
      },
      orderBy: {
        httpResponse: {
          timestamp: 'desc',
        },
      },
      where: {
        environmentId: id,
      },
    });

    return props;
  }

  /**
   * Recovers the last 100 database statistics ordered by the http response timestamp, given the environment id.
   * @since 0.5
   */
  static async getDatabaseStatisticsHistory(
    id: number
  ): Promise<DbStatistic[]> {
    const statistics = await prismaClient.statisticsHistory.findMany({
      select: {
        dbTraficRecieved: true,
        dbTraficSent: true,
        dbSize: true,
        httpResponse: true,
      },
      take: 100,
      orderBy: {
        httpResponse: {
          timestamp: 'desc',
        },
      },
      where: {
        environmentId: id,
      },
    });

    return statistics;
  }

  /**
   * Similar to getDatabaseStatisticsHistory, but returns only the latest statistic
   * @since 0.5
   */
  static async getLastDatabaseStatistic(): Promise<DbStatistic | null> {
    // TODO: Finish implementation

    return null;
  }
}
