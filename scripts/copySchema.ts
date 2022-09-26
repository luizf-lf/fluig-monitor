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

fs.copyFileSync(source, destination);

console.log(`${source} has been copied to ${destination}`);
