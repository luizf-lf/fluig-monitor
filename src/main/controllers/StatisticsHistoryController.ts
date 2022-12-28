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
  systemServerMemorySize: number;
  systemServerMemoryFree: number;
  systemServerHDSize: string;
  systemServerHDFree: string;
  systemServerCoreCount: number;
  systemServerArch: string;
  systemTmpFolderSize: number;
  systemLogFolderSize: number;
  systemHeapMaxSize: number;
  systemHeapSize: number;
  systemUptime: number;
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

export interface DBStats {
  dbTraficRecieved: bigint | null;
  dbTraficSent: bigint | null;
  dbSize: bigint | null;
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

  static async getHistoricalDiskInfo(id: number): Promise<HDStats[] | []> {
    const stats = await prismaClient.statisticsHistory.findMany({
      select: {
        systemServerHDFree: true,
        systemServerHDSize: true,
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

    return stats;
  }

  static async getHistoricalMemoryInfo(id: number): Promise<MemoryStats[]> {
    const stats = await prismaClient.statisticsHistory.findMany({
      select: {
        systemServerMemorySize: true,
        systemServerMemoryFree: true,
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

    return stats;
  }

  static async getHistoricalDatabaseInfo(id: number): Promise<DBStats[]> {
    const stats = await prismaClient.statisticsHistory.findMany({
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

    return stats;
  }
}
