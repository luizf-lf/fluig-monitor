export interface AuthKeysFormControllerInterface {
  payload: string;
  hash: string;
}
export interface AuthKeysControllerInterface
  extends AuthKeysFormControllerInterface {
  environmentId: number;
}
