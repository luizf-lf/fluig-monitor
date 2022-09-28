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
