import {
  Environment,
  EnvironmentAuthKeys,
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
