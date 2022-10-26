import prismaClient from '../database/prismaContext';
import { StatisticsHistory } from '../generated/client';
import HttpResponseController from './HttpResponseController';

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

export default class StatisticsHistoryController {
  created: StatisticsHistory | null;

  constructor() {
    this.created = null;
  }

  async new(data: CreateStatisticHistoryProps): Promise<StatisticsHistory> {
    const httpResponse = await new HttpResponseController().new({
      environmentId: data.environmentId,
      statusCode: data.statusCode,
      endpoint: data.endpoint,
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
}
