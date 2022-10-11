/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import log from 'electron-log';

interface AuthKeys {
  consumerKey: string;
  consumerSecret: string;
  accessToken: string;
  tokenSecret: string;
}

interface RequestData {
  url: string;
  method: string;
}

interface ConstructorProps {
  oAuthKeys: AuthKeys;
  requestData: RequestData;
  data?: any;
}

export default class FluigAPIClient {
  httpStatus: number | null;

  httpStatusText: string | null;

  httpResponse: any;

  decodedKeys: AuthKeys;

  requestData: RequestData;

  oAuth: OAuth;

  hasError: boolean;

  errorStack: string;

  constructor({ oAuthKeys, requestData }: ConstructorProps) {
    this.httpStatus = null;
    this.httpStatusText = null;
    this.httpResponse = null;

    this.decodedKeys = oAuthKeys;
    this.requestData = requestData;

    this.oAuth = new OAuth({
      consumer: {
        key: this.decodedKeys.consumerKey,
        secret: this.decodedKeys.consumerSecret,
      },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto
          .createHmac('sha1', key)
          .update(base_string)
          .digest('base64');
      },
    });

    this.hasError = false;
    this.errorStack = '';
  }

  async get() {
    try {
      const token = {
        key: this.decodedKeys.accessToken,
        secret: this.decodedKeys.tokenSecret,
      };

      log.info('FluigAPIClient: GET endpoint', this.requestData.url);

      const response = await axios.get(this.requestData.url, {
        headers: {
          ...this.oAuth.toHeader(this.oAuth.authorize(this.requestData, token)),
        },
      });

      this.httpStatus = response.status;
      this.httpStatusText = response.statusText;
      this.httpResponse = response.data;
    } catch (e: any) {
      if (e.response) {
        this.httpStatus = e.response.status;
        this.httpStatusText = e.response.statusText;
      }
      this.hasError = true;
      this.errorStack = e.stack;
    }
  }
}
