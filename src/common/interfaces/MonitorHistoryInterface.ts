interface FluigAPILicenseInterface {
  tenantId: string;
  activeUsers: string;
  totalLicenses: string;
  remainingLicenses: string;
}

interface FluigAPIMonitorItemInterface {
  name: string;
  status: string;
}

interface FluigAPIArtifactInterface {
  name: string;
  md5: string;
}

interface FluigAPIDetailedMemoryItemInterface {
  type: string;
  usage: {
    init: number;
    used: number;
    committed: number;
    max: number;
  };
  peakUsage: {
    init: number;
    used: number;
    committed: number;
    max: number;
  };
}

interface FluigAPIStatisticsInterface {
  DATA_SOURCE_FLUIGDS: {
    'max-pool-size': number;
    'min-pool-size': number;
    'active-count': number;
    'created-count': number;
    'max-used-count': number;
    'available-count': number;
  };
  DATA_SOURCE_FLUIGDSRO: {
    'max-pool-size': number;
    'min-pool-size': number;
    'active-count': number;
    'created-count': number;
    'max-used-count': number;
    'available-count': number;
  };
  DATABASE_INFO: {
    databaseName: string;
    databaseVersion: string;
    driverName: string;
    driverVersion: string;
  };
  CONNECTED_USERS: {
    connectedUsers: number;
  };
  MEMORY: {
    'heap-memory-usage': number;
    'non-heap-memory-usage': number;
  };
  DATABASE_TRAFFIC: {
    received: number;
    sent: number;
  };
  DATABASE_SIZE: {
    size: number;
  };
  ARTIFACTS_APPS_DIR: FluigAPIArtifactInterface[];
  ARTIFACTS_CORE_DIR: FluigAPIArtifactInterface[];
  ARTIFACTS_SYSTEM_DIR: FluigAPIArtifactInterface[];
  LOG_DIR_SIZE_MONITOR: {
    message: string;
  };
  TEMPLATE_DIR_SIZE: {
    message: string;
  };
  VOLUME_DIR_SIZE: {
    message: string;
  };
  TEMPORARY_DIR_SIZE: {
    message: string;
  };
  EXTERNAL_CONVERTER: {
    exists: boolean;
  };
  RUNTIME: {
    startTime: number;
    uptime: number;
  };
  THREADING: {
    count: number;
    peakCount: number;
    deamonCount: number;
    totalStartedCount: number;
  };
  DETAILED_MEMORY: {
    "CodeHeap 'non-nmethods'": FluigAPIDetailedMemoryItemInterface;
    Metaspace: FluigAPIDetailedMemoryItemInterface;
    "CodeHeap 'profiled nmethods'": FluigAPIDetailedMemoryItemInterface;
    'Compressed Class Space': FluigAPIDetailedMemoryItemInterface;
    'G1 Eden Space': FluigAPIDetailedMemoryItemInterface;
    'G1 Old Gen': FluigAPIDetailedMemoryItemInterface;
    'G1 Survivor Space': FluigAPIDetailedMemoryItemInterface;
    "CodeHeap 'non-profiled nmethods'": FluigAPIDetailedMemoryItemInterface;
  };
  OPERATION_SYSTEM: {
    'server-memory-size': number;
    'server-memory-free': number;
    'server-hd-space': string;
    'server-hd-space-free': string;
    'server-core-system': number;
    'server-arch-system': string;
    'server-temp-size': number;
    'server-log-size': number;
    'heap-max-size': number;
    'heap-size': number;
    'system-uptime': number;
  };
}

// final (conciliated) response data from server
export default interface MonitorHistoryInterface {
  environmentPK: {
    uuid: string;
    url: string;
  };
  requestEvent: {
    timestamp: EpochTimeStamp;
    totalDuration: number;
  };
  responseData: {
    monitors: {
      timestamp: EpochTimeStamp;
      responseTime: number;
      responseStatus: number;
      data: FluigAPIMonitorItemInterface[] | null;
    };
    statistics: {
      timestamp: EpochTimeStamp;
      responseTime: number;
      responseStatus: number;
      data: FluigAPIStatisticsInterface | null;
    };
    licenses: {
      timestamp: EpochTimeStamp;
      responseTime: number;
      responseStatus: number;
      data: FluigAPILicenseInterface | null;
    };
  };
}
