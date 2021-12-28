export default interface AmbientDataInterface {
  name: string;
  baseUrl: string;
  kind: string;
  auth: {
    consumerKey: string;
    consumerSecret: string;
    accessToken: string;
    tokenSecret: string;
  };
  update: {
    frequency: string;
    from: string;
    to: string;
    onlyOnWorkDays: boolean;
  };
}
