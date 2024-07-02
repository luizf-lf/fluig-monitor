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
 * Based on github.com/hajeonghun/electron-google-analytics4
 */
class GAnalytics {
  trackingID: string;

  secretKey: string;

  clientID: string;

  sessionID: string;

  customParams: CustomObject = {};

  userProperties: CustomObject | null = null;

  baseURL = 'https://google-analytics.com/mp';

  collectURL = '/collect';

  store: Store;

  enabled: boolean;

  eventQueue: CustomObject[] = [];

  constructor() {
    const { GA_TRACKING_ID, GA_SECRET_KEY } = process.env;

    this.enabled = true;
    this.store = new Store();
    this.trackingID = GA_TRACKING_ID || '';
    this.secretKey = GA_SECRET_KEY || '';
    this.clientID = randomUUID();
    this.sessionID = randomUUID();

    if (!GA_TRACKING_ID || !GA_SECRET_KEY) {
      log.info(
        'Tracking id and secret key not configured. Analytics will be disabled.'
      );
      this.enabled = false;
    }
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

  event(eventName: string) {
    if (!this.enabled) {
      return this;
    }

    this.eventQueue.push({
      name: eventName,
      params: this.customParams,
    });
    this.setParams();

    if (this.eventQueue.length >= 5) {
      // log.info(`Tracking events: ${this.eventQueue.map((item) => item.name)}`);
      const payload = {
        client_id: this.clientID,
        events: this.eventQueue,
      };
      if (this.userProperties) {
        Object.assign(payload, { user_properties: this.userProperties });
      }
      // log.info(JSON.stringify(payload));
      this.eventQueue = [];
      axios
        .post(
          `${this.baseURL}${this.collectURL}?measurement_id=${this.trackingID}&api_secret=${this.secretKey}`,
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
