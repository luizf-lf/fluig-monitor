import * as forge from 'node-forge';
import AuthObject from '../interfaces/AuthObject';

interface ConstructorProps {
  payload: string;
  hash: string;
  secret?: string;
}

export default class AuthKeysDecoder {
  /**
   * the payload string
   */
  payload: string;

  /**
   * the decoder hash
   */
  hash: string;

  /**
   * the decoder secret
   */
  secret: string;

  /**
   * The decoded AuthObject
   */
  decoded: AuthObject;

  constructor({ payload, hash, secret }: ConstructorProps) {
    this.payload = payload;
    this.hash = hash;
    this.secret = secret || '';
    this.decoded = {
      accessToken: '',
      consumerKey: '',
      consumerSecret: '',
      tokenSecret: '',
    };
  }

  /**
   * decodes the auth object accordingly
   * @returns {AuthObject} the decoded AuthObject
   */
  decode(): AuthObject | null {
    if (this.hash === 'json') {
      this.decoded = JSON.parse(this.payload);
    } else if (this.hash.indexOf('forge:') === 0) {
      const decipher = forge.cipher.createDecipher(
        'AES-CBC',
        forge.util.decode64(this.hash.split('forge:')[1])
      );
      decipher.start({ iv: forge.util.decode64(this.secret) });
      decipher.update(
        forge.util.createBuffer(forge.util.decode64(this.payload))
      );
      const result = decipher.finish();

      if (result) {
        this.decoded = JSON.parse(decipher.output.data);
        return this.decoded;
      }
      return null;
    }

    return this.decoded;
  }
}
