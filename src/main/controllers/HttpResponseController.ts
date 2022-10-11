import log from 'electron-log';
import prismaClient from '../database/prismaContext';
import { HTTPResponse } from '../generated/client';

interface CreateHttpResponseProps {
  environmentId: number;
  statusCode: number;
  endpoint?: string;
  timestamp: string;
  responseTimeMs: number;
}

export default class HttpResponseController {
  created: null | HTTPResponse;

  constructor() {
    this.created = null;
  }

  async new(data: CreateHttpResponseProps): Promise<HTTPResponse> {
    log.info(
      'HttpResponseController: Creating a new http response on the database'
    );
    this.created = await prismaClient.hTTPResponse.create({
      data,
    });

    return this.created;
  }
}
