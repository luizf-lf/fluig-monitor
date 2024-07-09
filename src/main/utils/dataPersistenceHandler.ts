import log from 'electron-log';
import prismaClient from '../database/prismaContext';
import GAEvents from '../analytics/GAEvents';

/**
 * Handles the monitored data persistence.
 */
export default async function dataPersistenceHandler() {
  try {
    const timer = Date.now();
    const persistenceThreshold = await prismaClient.appSetting.findUnique({
      where: {
        settingId: 'PERSISTENCE_THRESHOLD',
      },
    });

    if (persistenceThreshold && Number(persistenceThreshold.value) > 0) {
      log.info('dataPersistenceHandler: Starting data persistence handler.');

      const toBeDeleted = await prismaClient.hTTPResponse.findMany({
        where: {
          timestamp: {
            lte: new Date(
              Date.now() -
                Number(persistenceThreshold.value) * 24 * 60 * 60 * 1000
            ),
          },
        },
      });

      if (toBeDeleted.length > 0) {
        await prismaClient.licenseHistory.deleteMany({
          where: {
            httpResponseId: {
              in: toBeDeleted.map((item) => item.id),
            },
          },
        });
        await prismaClient.monitorHistory.deleteMany({
          where: {
            httpResponseId: {
              in: toBeDeleted.map((item) => item.id),
            },
          },
        });
        await prismaClient.statisticsHistory.deleteMany({
          where: {
            httpResponseId: {
              in: toBeDeleted.map((item) => item.id),
            },
          },
        });

        await prismaClient.hTTPResponse.deleteMany({
          where: {
            id: {
              in: toBeDeleted.map((item) => item.id),
            },
          },
        });

        log.info(
          `dataPersistenceHandler: ${
            toBeDeleted.length
          } log lines deleted after ${Date.now() - timer}ms.`
        );

        GAEvents.linesDeletedByPersistenceHandler(
          persistenceThreshold.value,
          toBeDeleted.length,
          timer
        );
      } else {
        log.info('dataPersistenceHandler: Nothing to delete.');
      }
    }
  } catch (error) {
    log.error(
      'dataPersistenceHandler: Could not execute the data persistence handler:',
      error
    );
  }
}
