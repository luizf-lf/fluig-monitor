import log from 'electron-log';
import prismaClient from '../database/prismaContext';
import { HTTPResponse } from '../generated/client';

interface CreateHttpResponseProps {
  environmentId: number;
  statusCode: number;
  statusMessage?: string;
  endpoint?: string;
  resourceType?: string;
  timestamp: string;
  responseTimeMs: number;
  hostConnected: boolean;
}

export default class HttpResponseController {
  created: null | HTTPResponse;

  constructor() {
    this.created = null;
  }

  async new(
    data: CreateHttpResponseProps,
    silent?: boolean
  ): Promise<HTTPResponse> {
    if (!silent) {
      log.info(
        'HttpResponseController: Creating a new http response on the database'
      );
    }
    this.created = await prismaClient.hTTPResponse.create({
      data: {
        environment: {
          connect: {
            id: data.environmentId,
          },
        },
        statusCode: data.statusCode,
        statusMessage: data.statusMessage,
        endpoint: data.endpoint,
        resourceType: data.resourceType,
        timestamp: data.timestamp,
        responseTimeMs: data.responseTimeMs,
        hostConnected: data.hostConnected,
      },
    });

    return this.created;
  }
}
