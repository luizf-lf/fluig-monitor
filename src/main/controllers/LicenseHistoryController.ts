import { LicenseHistory } from '../generated/client';
import prismaClient from '../database/prismaContext';
import HttpResponseController from './HttpResponseController';

interface LogLicenseProps {
  environmentId: number;
  statusCode: number;
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

export default class LicenseHistoryController {
  created: LicenseHistory | null;

  constructor() {
    this.created = null;
  }

  async new({
    environmentId,
    statusCode,
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
      endpoint,
      timestamp,
      responseTimeMs,
    });

    const createdLicenseHistory = await prismaClient.licenseHistory.create({
      data: {
        activeUsers,
        remainingLicenses,
        tenantId,
        totalLicenses,
        environmentId,
        httpResponseId: httpResponse.id,
      },
    });

    this.created = createdLicenseHistory;

    return this.created;
  }
}
