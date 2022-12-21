import * as forge from 'node-forge';
import log from 'electron-log';
import AuthObject from '../interfaces/AuthObject';

interface EncryptedPayload {
  encrypted: string;
  key: string;
  iv: string;
}

export default class AuthKeysEncoder {
  /**
   * The pain oAuth object
   */
  authObject: AuthObject;

  /**
   * The encrypted auth object as a string
   */
  encryptedAuthObject: EncryptedPayload | null = null;

  /**
   * The verification hash string
   */
  hashString: string = '';

  constructor(auth: AuthObject) {
    this.authObject = auth;
  }

  encode(): EncryptedPayload | null {
    try {
      const key = forge.random.getBytesSync(32);
      const iv = forge.random.getBytesSync(32);

      const cipher = forge.cipher.createCipher('AES-CBC', key);
      cipher.start({ iv });
      cipher.update(forge.util.createBuffer(JSON.stringify(this.authObject)));
      cipher.finish();

      const encrypted = cipher.output.data;

      this.encryptedAuthObject = {
        encrypted: forge.util.encode64(String(encrypted)),
        key: forge.util.encode64(String(key)),
        iv: forge.util.encode64(String(iv)),
      };

      return this.encryptedAuthObject;
    } catch (error) {
      log.error('Could not encode the authentication keys:');
      log.error(error);

      return null;
    }
  }
}
