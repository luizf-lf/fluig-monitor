import { app, screen } from 'electron';
import os from 'node:os';

import appStateHelper from './appStateHelper';
import { version } from '../../../package.json';
import analytics from './GAnalytics';

/**
 * Google Analytics events abstraction object.
 * @since 1.1.0
 */
const GAEvents = {
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

  environmentCreated(
    timer: number,
    release: string,
    kind: string,
    pingInterval: string,
    scrapeInterval: string
  ) {
    analytics
      .setParams({
        engagement_time_msec: Date.now() - timer,
        category: 'Environments',
        label: 'Environment created',
        release,
        kind,
        ping_interval: pingInterval,
        scrape_interval: scrapeInterval,
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

  environmentUpdated(
    timer: number,
    release: string,
    kind: string,
    pingInterval: string,
    scrapeInterval: string
  ) {
    analytics
      .setParams({
        engagement_time_msec: Date.now() - timer,
        category: 'Environments',
        label: 'Environment updated',
        release,
        kind,
        ping_interval: pingInterval,
        scrape_interval: scrapeInterval,
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

export default GAEvents;
