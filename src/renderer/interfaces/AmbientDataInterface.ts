export default interface AmbientDataInterface {
  name: string;
  url: string;
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
    updateOnWorkDays: boolean;
  };
}
