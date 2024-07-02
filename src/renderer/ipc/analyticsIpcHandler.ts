/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipcRenderer } from 'electron';

export function reportAnalyticsEvent(
  event: string,
  params: { [key: string]: any }
) {
  ipcRenderer.invoke('analytics', event, params);
}

export function reportPageView(
  page_id: string,
  page_title: string,
  page_location: string
) {
  reportAnalyticsEvent('page_view', {
    page_id,
    page_title,
    page_location,
    engagement_time_msec: 1000,
  });
}
