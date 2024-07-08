/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { randomUUID } from 'crypto';
import { app } from 'electron';
import log from 'electron-log';
import Store from 'electron-store';

interface CustomObject {
  [key: string]: any;
}

/**
 * Google Analytics handler class.
 * Based on hajeonghun/electron-google-analytics4
 * @see https://github.com/hajeonghun/electron-google-analytics4
 * @since 1.1.0
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

  queueThreshold = 15;

  pushTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.analyticsEnabled = true;
    this.store = new Store();
    this.sessionID = randomUUID();
    this.clientID = '';

    this.debugEnabled = !app.isPackaged;
  }

  config(trackingId: string, secretKey: string): GAnalytics {
    this.trackingID = trackingId || '';
    this.secretKey = secretKey || '';

    this.clientID = this.getClientId();

    if (
      !trackingId ||
      !secretKey ||
      trackingId.length === 0 ||
      secretKey.length === 0
    ) {
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

  event(eventName: string, forcePush = false): GAnalytics {
    if (!this.analyticsEnabled) {
      return this;
    }

    this.eventQueue.push({
      name: eventName,
      params: this.customParams,
    });
    this.setParams();

    this.handleQueue(forcePush);

    return this;
  }

  handleQueue(forcePush = false) {
    if (this.eventQueue.length >= this.queueThreshold || forcePush) {
      if (this.debugEnabled) {
        log.debug(
          `Tracking ${this.eventQueue.length} events: ${this.eventQueue.map(
            (item) => item.name
          )}`
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

      if (payload.events.length > 0) {
        axios
          .post(
            `${this.baseURL}?measurement_id=${this.trackingID}&api_secret=${this.secretKey}`,
            payload
          )
          .then((res) => {
            log.info(`Events sent. HTTP ${res.status}`);
            this.eventQueue = [];
            return res;
          })
          .catch((err: Error) => {
            log.error(
              'Error sending analytics events. Tying again in 30 seconds.'
            );
            log.error(err.message);

            this.pushWithTimeout();
          });
      }
    } else if (this.eventQueue.length > 0) {
      this.pushWithTimeout();
    }
  }

  pushWithTimeout() {
    if (this.pushTimeout) {
      clearTimeout(this.pushTimeout);
    }
    this.pushTimeout = setTimeout(() => {
      this.handleQueue(true);
    }, 30000);
  }
}

const analytics = new GAnalytics();

export default analytics;
