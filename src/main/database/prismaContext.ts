import { PrismaClient } from '@prisma/client';
import { qePath, dbUrl } from '../utils/defaultConstants';

const prismaClient = new PrismaClient({
  log: ['info', 'warn', 'error'],
  datasources: {
    db: {
      url: dbUrl,
    },
  },
  // see https://github.com/prisma/prisma/discussions/5200
  __internal: {
    engine: {
      binaryPath: qePath,
    },
  },
});

export default prismaClient;
