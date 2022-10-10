interface ConstructorProps {
  payload: string;
  hash: string;
}

interface AuthKeys {
  consumerKey: string;
  consumerSecret: string;
  accessToken: string;
  tokenSecret: string;
}

export default class AuthKeysDecoder {
  payload: string;

  hash: string;

  decoded: AuthKeys;

  constructor({ payload, hash }: ConstructorProps) {
    this.payload = payload;
    this.hash = hash;
    this.decoded = {
      accessToken: '',
      consumerKey: '',
      consumerSecret: '',
      tokenSecret: '',
    };
  }

  decode(): AuthKeys {
    if (this.hash === 'json') {
      this.decoded = JSON.parse(this.payload);
    }

    if (this.hash.indexOf('forge:') === 0) {
      // TODO: Implement
    }

    return this.decoded;
  }
}
