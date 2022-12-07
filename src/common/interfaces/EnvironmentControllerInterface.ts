import {
  Environment,
  EnvironmentAuthKeys,
  HTTPResponse,
  LicenseHistory,
  MonitorHistory,
  StatisticsHistory,
  UpdateSchedule,
} from '../../main/generated/client';

export interface EnvironmentCreateControllerInterface {
  name: string;
  release: string;
  baseUrl: string;
  kind: string;
  logDeleted?: boolean;
}

export interface EnvironmentUpdateControllerInterface
  extends EnvironmentCreateControllerInterface {
  id: number;
}

export interface EnvironmentWithRelatedData extends Environment {
  updateScheduleId: UpdateSchedule | null;
  oAuthKeysId: EnvironmentAuthKeys | null;
}

export interface EnvironmentWithHistory extends Environment {
  licenseHistory: LicenseHistoryWithHttpResponse[];
  statisticHistory: StatisticsHistoryWithHttpResponse[];
  monitorHistory: MonitorHistoryWithHttpResponse[];
  httpResponses: HTTPResponse[];
}

export interface LicenseHistoryWithHttpResponse extends LicenseHistory {
  httpResponse: HTTPResponse;
}

export interface StatisticsHistoryWithHttpResponse extends StatisticsHistory {
  httpResponse: HTTPResponse;
}

export interface MonitorHistoryWithHttpResponse extends MonitorHistory {
  httpResponse: HTTPResponse;
}
