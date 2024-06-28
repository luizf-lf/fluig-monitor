import log from 'electron-log';
import prismaClient from '../database/prismaContext';
import { MonitorHistory } from '../generated/client';
import HttpResponseController from './HttpResponseController';
import HttpResponseResourceType from '../../common/interfaces/HttpResponseResourceTypes';

interface MonitorItem {
  name: string;
  status: string;
}

interface MonitorHistoryCreateProps {
  environmentId: number;
  statusCode: number;
  statusMessage: string;
  timestamp: string;
  responseTimeMs: number;
  endpoint?: string;
  monitorData: MonitorItem[];
  hostConnected: boolean;
}

export default class MonitorHistoryController {
  created: MonitorHistory | null;

  constructor() {
    this.created = null;
  }

  async new(data: MonitorHistoryCreateProps): Promise<MonitorHistory> {
    const analytics = data.monitorData.find(
      (i) => i.name === 'ANALYTICS_AVAIABILITY'
    )?.status;
    const licenseServer = data.monitorData.find(
      (i) => i.name === 'LICENSE_SERVER_AVAILABILITY'
    )?.status;
    const mailServer = data.monitorData.find(
      (i) => i.name === 'MAIL_SERVER_AVAILABILITY'
    )?.status;
    const MSOffice = data.monitorData.find(
      (i) => i.name === 'MS_OFFICE_AVAILABILITY'
    )?.status;
    const openOffice = data.monitorData.find(
      (i) => i.name === 'OPEN_OFFICE_AVAILABILITY'
    )?.status;
    const realTime = data.monitorData.find(
      (i) => i.name === 'REAL_TIME_AVAILABILITY'
    )?.status;
    const solrServer = data.monitorData.find(
      (i) => i.name === 'SOLR_SERVER_AVAILABILITY'
    )?.status;
    const viewer = data.monitorData.find(
      (i) => i.name === 'VIEWER_AVAILABILITY'
    )?.status;

    const httpResponse = await new HttpResponseController().new({
      environmentId: data.environmentId,
      statusCode: data.statusCode,
      statusMessage: data.statusMessage,
      endpoint: data.endpoint,
      resourceType: HttpResponseResourceType.MONITOR,
      timestamp: data.timestamp,
      responseTimeMs: data.responseTimeMs,
      hostConnected: data.hostConnected,
    });

    log.info(
      'MonitorHistoryController: Creating a new monitor history on the database'
    );
    this.created = await prismaClient.monitorHistory.create({
      data: {
        environmentId: data.environmentId,
        httpResponseId: httpResponse.id,
        analytics,
        licenseServer,
        mailServer,
        MSOffice,
        openOffice,
        realTime,
        solrServer,
        viewer,
      },
    });

    return this.created;
  }
}
