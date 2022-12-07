export interface UpdateScheduleFormControllerInterface {
  scrapeFrequency: string;
  pingFrequency: string;
}
export interface UpdateScheduleControllerInterface
  extends UpdateScheduleFormControllerInterface {
  environmentId: number;
}
