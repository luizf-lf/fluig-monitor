/* eslint-disable @typescript-eslint/no-explicit-any */
import log from 'electron-log';
import Store from 'electron-store';
import { randomUUID } from 'crypto';
import axios from 'axios';
import { app, screen } from 'electron';
import os from 'node:os';

import appStateHelper from './appStateHelper';
import { version } from '../../../package.json';

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

  pushTimeout: NodeJS.Timeout | null = null;

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
    if (this.eventQueue.length >= 5 || forcePush) {
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

export const GAEvents = {
  appStarted(timer: number) {
    const { width, height } = screen.getPrimaryDisplay().size;

    analytics
      .setParams({
        engagement_time_msec: appStateHelper.startedAt - timer,
        category: 'Application',
        label: 'Application started',
        app_version: version,
        app_name: app.name,
        app_mode: app.isPackaged ? 'production' : 'development',
        screen_resolution: `${width}x${height}`,
        os_platform: os.platform(),
        os_type: os.type(),
        os_release: os.release(),
        os_arch: os.arch(),
      })
      .event('app_started');
  },

  appMinimized() {
    appStateHelper.setIsMinimized();

    analytics
      .setParams({
        engagement_time_msec: appStateHelper.getEngagementTime(),
        category: 'Application',
        label: 'Application minimized',
      })
      .event('app_minimized');
  },

  appMaximized() {
    analytics
      .setParams({
        engagement_time_msec: 100,
        category: 'Application',
        label: 'Application maximized',
      })
      .event('app_maximized');
  },

  appResized(size: string) {
    analytics
      .setParams({
        engagement_time_msec: 100,
        category: 'Application',
        label: 'Application resized',
        size,
      })
      .event('app_resized');
  },

  appBlur() {
    appStateHelper.setIsBlurred();
    analytics
      .setParams({
        engagement_time_msec: appStateHelper.getEngagementTime(),
        category: 'Application',
        label: 'Application blurred',
      })
      .event('app_blurred');
  },

  appFocus() {
    appStateHelper.setIsFocused();
    analytics
      .setParams({
        engagement_time_msec: appStateHelper.getEngagementTime(),
        category: 'Application',
        label: 'Application focused',
      })
      .event('app_focused');
  },

  appRestored() {
    appStateHelper.setIsRestored();
    analytics
      .setParams({
        engagement_time_msec: appStateHelper.getEngagementTime(),
        category: 'Application',
        label: 'Application restored',
      })
      .event('app_restored');
  },

  appClosed(ref: string) {
    appStateHelper.setIsClosed();
    analytics
      .setParams({
        engagement_time_msec: appStateHelper.getEngagementTime(),
        category: 'Application',
        label: 'Application closed',
        ref,
      })
      .event('app_closed', true);
  },

  appFullScreen(isFullScreen: boolean) {
    analytics
      .setParams({
        engagement_time_msec: 100,
        category: 'Application',
        label: 'Application fullscreen',
        is_fullscreen: isFullScreen,
      })
      .event('app_fullscreen');
  },

  appError(error: Error) {
    analytics
      .setParams({
        engagement_time_msec: 100,
        category: 'Error',
        label: 'Application error',
        error_name: error.name,
        error_message: error.message,
      })
      .event('error');
  },

  updateRefused(timer: number) {
    analytics
      .setParams({
        engagement_time_msec: Date.now() - timer,
        category: 'Update',
        label: 'Update refused',
      })
      .event('update_refused');
  },

  languageChanged(language: string) {
    analytics
      .setParams({
        engagement_time_msec: 100,
        category: 'Language',
        label: 'Language changed',
        language,
      })
      .event('language_changed');
  },

  generateLead(source: string, target: string) {
    analytics
      .setParams({
        engagement_time_msec: 100,
        category: 'Lead',
        label: 'Lead generated',
        lead_source: source,
        target,
      })
      .event('lead_generated');
  },

  environmentCreated(timer: number, release: string, kind: string) {
    analytics
      .setParams({
        engagement_time_msec: Date.now() - timer,
        category: 'Environments',
        label: 'Environment created',
        release,
        kind,
      })
      .event('env_created');
  },

  environmentDeleted(timer: number, release: string, kind: string) {
    analytics
      .setParams({
        engagement_time_msec: Date.now() - timer,
        category: 'Environments',
        label: 'Environment deleted',
        release,
        kind,
      })
      .event('env_deleted');
  },

  environmentUpdated(timer: number, release: string, kind: string) {
    analytics
      .setParams({
        engagement_time_msec: Date.now() - timer,
        category: 'Environments',
        label: 'Environment updated',
        release,
        kind,
      })
      .event('env_updated');
  },

  dbMigrated(timer: number) {
    analytics
      .setParams({
        engagement_time_msec: Date.now() - timer,
        category: 'Database',
        label: 'Database migrated',
      })
      .event('db_migrated');
  },

  syncExecuted(timer: number, hostConnected: boolean) {
    analytics
      .setParams({
        engagement_time_msec: Date.now() - timer,
        category: 'Monitoring',
        label: 'Synchronization Executed',
        host_connected: hostConnected,
      })
      .event('sync_executed');
  },

  hostDisconnected() {
    analytics
      .setParams({
        engagement_time_msec: 100,
        category: 'Monitoring',
        label: 'Host disconnected',
      })
      .event('host_disconnected');
  },

  environmentHighResponseTime(responseTimeMs: number) {
    analytics
      .setParams({
        engagement_time_msec: 100,
        category: 'Environments',
        label: 'Environment high response time',
        response_time_ms: responseTimeMs,
      })
      .event('env_high_response_time');
  },

  environmentNormalResponseTime(responseTimeMs: number) {
    analytics
      .setParams({
        engagement_time_msec: 100,
        category: 'Environments',
        label: 'Environment normal response time',
        response_time_ms: responseTimeMs,
      })
      .event('env_normal_response_time');
  },

  environmentBackOnline() {
    analytics
      .setParams({
        engagement_time_msec: 100,
        category: 'Environments',
        label: 'Environment back online',
      })
      .event('env_back_online');
  },

  environmentOffline() {
    analytics
      .setParams({
        engagement_time_msec: 100,
        category: 'Environments',
        label: 'Environment offline',
      })
      .event('env_offline');
  },
};
