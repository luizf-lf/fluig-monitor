/* eslint-disable no-console */
import { existsSync, rmSync, writeFileSync } from 'fs';

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateHttpResponses() {
  let statement =
    'INSERT INTO HTTPResponse (id, environmentId, timestamp, endpoint, statusCode, statusMessage, responseTimeMs, resourceType) \n VALUES ';
  const sqlFile = './insert.sql';
  const step = 15000; // 15s
  const now = Date.now();
  let timestamp = new Date(Date.now() - 86400000).getTime();
  let id = 11; // should be changed according to the last database id
  let counter = 0;

  while (timestamp < now) {
    statement += `(${id}, ${1}, ${timestamp}, 'http://mock.fluig.com/api/servlet/ping', 200, 'OK', ${randomNumber(
      200,
      250
    )}, 'PING'),\n`;

    id += 1;
    counter += 1;
    timestamp += step;
  }

  if (existsSync(sqlFile)) {
    rmSync(sqlFile);
  }

  writeFileSync(sqlFile, statement, {
    encoding: 'utf-8',
  });

  console.log(`Generated ${counter} insert statements.`);
}

generateHttpResponses();
