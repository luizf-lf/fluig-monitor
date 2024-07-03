/* eslint-disable @typescript-eslint/no-explicit-any */
import log from 'electron-log';
import Store from 'electron-store';
import { randomUUID } from 'crypto';
import axios from 'axios';

interface CustomObject {
  [key: string]: any;
}

/**
 * Google Analytics handler class.
 * Based on hajeonghun/electron-google-analytics4
 * @see https://github.com/hajeonghun/electron-google-analytics4
 */
class GAnalytics {
  trackingID: string | undefined;

  secretKey: string | undefined;

  clientID: string;

  sessionID: string;

  customParams: CustomObject = {};

  userProperties: CustomObject | null = null;

  baseURL = 'https://google-analytics.com/mp/collect';

  store: Store;

  analyticsEnabled: boolean;

  debugEnabled: boolean;

  eventQueue: CustomObject[] = [];

  constructor() {
    this.analyticsEnabled = true;
    this.store = new Store();
    this.sessionID = randomUUID();
    this.clientID = '';

    this.debugEnabled = true;
  }

  config(
    trackingId: string | undefined,
    secretKey: string | undefined
  ): GAnalytics {
    this.trackingID = trackingId || '';
    this.secretKey = secretKey || '';

    this.clientID = this.getClientId();

    if (!trackingId || !secretKey) {
      log.info(
        'Tracking id and secret key not configured. Analytics will be disabled.'
      );
      this.analyticsEnabled = false;
    }

    return this;
  }

  getClientId() {
    let clientId = this.store.get('clientId') as string;

    if (!clientId) {
      clientId = randomUUID();
      this.store.set('clientId', clientId);
    }

    this.clientID = clientId;
    return this.clientID;
  }

  set(key: string, value: string | number): GAnalytics {
    if (value !== null) {
      this.customParams[key] = value;
    } else {
      delete this.customParams[key];
    }
    return this;
  }

  setParams(params?: CustomObject): GAnalytics {
    if (typeof params === 'object' && Object.keys(params).length > 0) {
      Object.assign(this.customParams, params);
    } else {
      this.customParams = {};
    }
    return this;
  }

  setUserProperties(upValue: CustomObject): GAnalytics {
    if (typeof upValue === 'object' && Object.keys(upValue).length > 0) {
      this.userProperties = upValue;
    } else {
      this.userProperties = null;
    }
    return this;
  }

  event(eventName: string, forcePush = false) {
    if (!this.analyticsEnabled) {
      return this;
    }

    this.eventQueue.push({
      name: eventName,
      params: this.customParams,
    });
    this.setParams();

    if (this.eventQueue.length >= 5 || forcePush) {
      if (this.debugEnabled) {
        log.debug(
          `Tracking events: ${this.eventQueue.map((item) => item.name)}`
        );
      }

      const payload = {
        client_id: this.clientID,
        events: this.eventQueue,
      };
      if (this.userProperties) {
        Object.assign(payload, { user_properties: this.userProperties });
      }

      if (this.debugEnabled) {
        log.debug(`Events payload: ${JSON.stringify(payload)}`);
      }

      this.eventQueue = [];
      axios
        .post(
          `${this.baseURL}?measurement_id=${this.trackingID}&api_secret=${this.secretKey}`,
          payload
        )
        .then((res) => {
          log.info(`Events sent - ${res.status}`);
          return res;
        })
        .catch((err) => {
          log.error('Error sending analytics events');
          log.error(err);
        });
    }

    return this;
  }
}

const analytics = new GAnalytics();

export default analytics;
