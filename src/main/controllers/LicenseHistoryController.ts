import log from 'electron-log';
import { HTTPResponse, LicenseHistory } from '../generated/client';
import prismaClient from '../database/prismaContext';
import HttpResponseController from './HttpResponseController';
import HttpResponseResourceType from '../../common/interfaces/HttpResponseResourceTypes';

interface LogLicenseProps {
  environmentId: number;
  statusCode: number;
  statusMessage: string;
  timestamp: string;
  endpoint?: string;
  responseTimeMs: number;
  licenseData: {
    activeUsers: number;
    remainingLicenses: number;
    tenantId: number;
    totalLicenses: number;
  };
}

export interface EnvironmentLicenseData {
  id: number;
  activeUsers: number;
  remainingLicenses: number;
  totalLicenses: number;
  tenantId: number;
  httpResponse: HTTPResponse;
}

export default class LicenseHistoryController {
  created: LicenseHistory | null;

  constructor() {
    this.created = null;
  }

  async new({
    environmentId,
    statusCode,
    statusMessage,
    timestamp,
    endpoint,
    responseTimeMs,
    licenseData,
  }: LogLicenseProps): Promise<LicenseHistory> {
    const { activeUsers, remainingLicenses, tenantId, totalLicenses } =
      licenseData;
    const httpResponse = await new HttpResponseController().new({
      environmentId,
      statusCode,
      statusMessage,
      endpoint,
      resourceType: HttpResponseResourceType.LICENSES,
      timestamp,
      responseTimeMs,
    });

    log.info(
      'LicenseHistoryController: Creating a new license history on the database'
    );
    this.created = await prismaClient.licenseHistory.create({
      data: {
        activeUsers,
        remainingLicenses,
        tenantId,
        totalLicenses,
        environmentId,
        httpResponseId: httpResponse.id,
      },
    });

    return this.created;
  }

  /**
   * Gets the latest license data from a given environment by id.
   * @since 0.5
   */
  static async getLastLicenseData(
    environmentId: number
  ): Promise<EnvironmentLicenseData | null> {
    const licenseData = await prismaClient.licenseHistory.findFirst({
      select: {
        id: true,
        activeUsers: true,
        remainingLicenses: true,
        totalLicenses: true,
        tenantId: true,
        httpResponse: true,
      },
      orderBy: {
        httpResponse: {
          timestamp: 'desc',
        },
      },
      where: {
        environmentId,
      },
    });

    return licenseData;
  }
}
