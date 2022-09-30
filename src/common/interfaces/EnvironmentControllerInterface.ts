import {
  Environment,
  EnvironmentAuthKeys,
  MonitorHistory,
  UpdateSchedule,
} from '../../main/generated/client';

export interface EnvironmentControllerInterface {
  name: string;
  release: string;
  baseUrl: string;
  kind: string;
  logDeleted?: boolean;
}

export interface EnvironmentUpdateControllerInterface {
  id: number;
  name?: string;
  release?: string;
  baseUrl?: string;
  kind?: string;
  logDeleted?: boolean;
}

export interface EnvironmentWithRelatedData extends Environment {
  updateScheduleId: UpdateSchedule;
  oAuthKeysId: EnvironmentAuthKeys;
  monitorHistory: MonitorHistory[];
}
