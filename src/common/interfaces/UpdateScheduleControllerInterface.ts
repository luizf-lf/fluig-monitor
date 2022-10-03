export interface UpdateScheduleFormControllerInterface {
  frequency: string;
  from: string;
  to: string;
  onlyOnWorkDays: boolean;
}
export interface UpdateScheduleControllerInterface
  extends UpdateScheduleFormControllerInterface {
  environmentId: number;
}
