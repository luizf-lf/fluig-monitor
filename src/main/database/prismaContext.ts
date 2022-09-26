import { PrismaClient } from '../generated/client';
import { qePath, dbUrl } from '../utils/defaultConstants';

const prismaClient = new PrismaClient({
  log: ['info', 'warn', 'error'],
  datasources: {
    db: {
      url: dbUrl,
    },
  },
  // see https://github.com/prisma/prisma/discussions/5200
  // @ts-expect-error internal prop
  __internal: {
    engine: {
      binaryPath: qePath,
    },
  },
});

export default prismaClient;
