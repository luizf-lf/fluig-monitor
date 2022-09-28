export interface UpdateScheduleControllerInterface {
  frequency: string;
  from: string;
  to: string;
  onlyOnWorkDays: boolean;
  environmentId: number;
}
