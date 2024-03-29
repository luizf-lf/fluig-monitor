import * as forge from 'node-forge';
import log from 'electron-log';
import Store from 'electron-store';
import AuthObject from '../interfaces/AuthObject';

interface ConstructorProps {
  payload: string;
  hash: string;
  environmentId: number;
  secret?: string;
}

export default class AuthKeysDecoder {
  /**
   * the environment id referenced by the keys
   */
  environmentId: number;

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
  decoded: AuthObject | null;

  constructor({ payload, hash, secret, environmentId }: ConstructorProps) {
    this.payload = payload;
    this.hash = hash;
    this.secret = secret || '';
    this.environmentId = environmentId;
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
    try {
      if (this.hash === 'json') {
        this.decoded = JSON.parse(this.payload);
      } else if (this.hash.indexOf('forge:') === 0) {
        this.secret = new Store().get(
          `envToken_${this.environmentId}`
        ) as string;
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
        this.decoded = null;
      }

      return this.decoded;
    } catch (error) {
      log.error('Could not decode the authentication keys:');
      log.error(error);

      return null;
    }
  }
}
