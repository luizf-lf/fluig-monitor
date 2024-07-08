/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipcRenderer } from 'electron';

export function reportAnalyticsEvent(
  event: string,
  params: { [key: string]: any }
) {
  ipcRenderer.invoke('analytics', event, params);
}

export const GAEventsIPC = {
  pageView(
    page_id: string,
    page_title: string,
    timer: number,
    page_location: string,
    page_referrer: string
  ) {
    reportAnalyticsEvent('page_view', {
      page_id,
      page_title,
      page_location,
      page_referrer,
      engagement_time_msec: Date.now() - timer,
    });
  },

  buttonClick(button_id: string, button_label: string) {
    reportAnalyticsEvent('button_click', {
      button_id,
      button_label,
      engagement_time_msec: 100,
    });
  },

  generateLead(source: string, target: string) {
    reportAnalyticsEvent('lead_generated', {
      lead_source: source,
      target,
    });
  },

  themeChanged(theme: string) {
    reportAnalyticsEvent('theme_changed', {
      theme,
    });
  },
};
