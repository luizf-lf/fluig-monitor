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
}

export default class FluigAPIClient {
  /**
   * The Http request status code (ex.: 200, 404, 500)
   */
  httpStatus: number | null;

  /**
   * The http request status code message (Ex.: If it's 200: 'Ok', if it's 500: 'Internal Server Error')
   */
  httpStatusText: string;

  /**
   * The http response data from the API (Usually a JSON)
   */
  httpResponse: any;

  /**
   * The decoded auth keys passed as an argument on the constructor
   */
  decodedKeys: AuthKeys;

  /**
   * The RequestData object containing the url endpoint and method (Currently only GET is supported)
   */
  requestData: RequestData;

  /**
   * The oAuth helper from the oAuth-1.0a library
   */
  oAuth: OAuth;

  /**
   * If the fluig client class has an error
   */
  hasError: boolean;

  /**
   * The error stack, if the fluig client class has an error
   */
  errorStack: string;

  constructor({ oAuthKeys, requestData }: ConstructorProps) {
    this.httpStatus = null;
    this.httpStatusText = '';
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

  /**
   * Makes a GET request
   * @param silent if the request should not write logs (defaults to false)
   */
  async get(silent?: boolean, timeout?: number | null) {
    try {
      const token = {
        key: this.decodedKeys.accessToken,
        secret: this.decodedKeys.tokenSecret,
      };

      if (!silent) {
        log.info('FluigAPIClient: GET endpoint', this.requestData.url);
      }

      const response = await axios.get(this.requestData.url, {
        headers: {
          ...this.oAuth.toHeader(this.oAuth.authorize(this.requestData, token)),
        },
        timeout: timeout || 60000, // defaults the timeout to 60 seconds
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
