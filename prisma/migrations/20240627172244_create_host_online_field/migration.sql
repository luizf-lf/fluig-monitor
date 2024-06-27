/*
  Warnings:

  - Added the required column `hostConnected` to the `HTTPResponse` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HTTPResponse" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "environmentId" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hostConnected" BOOLEAN NOT NULL,
    "endpoint" TEXT,
    "resourceType" TEXT,
    "statusCode" INTEGER NOT NULL,
    "statusMessage" TEXT,
    "responseTimeMs" INTEGER NOT NULL,
    CONSTRAINT "HTTPResponse_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_HTTPResponse" ("endpoint", "environmentId", "id", "resourceType", "responseTimeMs", "statusCode", "statusMessage", "timestamp") SELECT "endpoint", "environmentId", "id", "resourceType", "responseTimeMs", "statusCode", "statusMessage", "timestamp" FROM "HTTPResponse";
DROP TABLE "HTTPResponse";
ALTER TABLE "new_HTTPResponse" RENAME TO "HTTPResponse";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
