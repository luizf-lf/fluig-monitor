/* eslint-disable no-console */
import path from 'path';
import fs from 'fs';

const source = path.resolve(__dirname, '../', 'prisma', 'schema.prisma');
const destination = path.resolve(
  __dirname,
  '../',
  'release',
  'app',
  'dist',
  'main',
  'schema.prisma'
);

console.log('📦 Copying prisma schema to build folder.');

fs.copyFileSync(source, destination);

console.log(`✅ Prisma Schema copied to ${destination}`);
