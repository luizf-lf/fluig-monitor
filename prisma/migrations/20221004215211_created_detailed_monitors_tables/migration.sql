/*
  Warnings:

  - You are about to drop the `APIResponse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `timestamp` on the `MonitorHistory` table. All the data in the column will be lost.
  - Added the required column `httpResponseId` to the `MonitorHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "APIResponse";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "HTTPResponse" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "environmentId" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statusCode" INTEGER NOT NULL,
    "responseTimeMs" INTEGER NOT NULL,
    CONSTRAINT "HTTPResponse_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LicenceHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "environmentId" INTEGER NOT NULL,
    "httpResponseId" INTEGER NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "activeUsers" INTEGER NOT NULL,
    "totalLicenses" INTEGER NOT NULL,
    "remainingLicenses" INTEGER NOT NULL,
    CONSTRAINT "LicenceHistory_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LicenceHistory_httpResponseId_fkey" FOREIGN KEY ("httpResponseId") REFERENCES "HTTPResponse" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StatisticsHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "environmentId" INTEGER NOT NULL,
    "httpResponseId" INTEGER NOT NULL,
    "dataSourceFluigDs" TEXT,
    "dataSourceFluigDsRo" TEXT,
    "dbName" TEXT,
    "dbVersion" TEXT,
    "dbDriverName" TEXT,
    "dbDriverVersion" TEXT,
    "connectedUsers" INTEGER,
    "memoryHeap" INTEGER,
    "nonMemoryHeap" INTEGER,
    "dbTraficRecieved" TEXT,
    "dbTraficSent" TEXT,
    "dbSize" INTEGER,
    "artifactsApps" TEXT,
    "artifactsCore" TEXT,
    "artifactsSystem" TEXT,
    "externalConverter" BOOLEAN,
    "runtimeStart" DATETIME,
    "runtimeUptime" INTEGER,
    "threadingCount" INTEGER,
    "threadingPeakCount" INTEGER,
    "threadingDaemonCount" INTEGER,
    "threadingTotalStarted" INTEGER,
    "detailedMemory" TEXT,
    "systemServerMemorySize" INTEGER,
    "systemServerMemoryFree" INTEGER,
    "systemServerHDSize" TEXT,
    "systemServerHDFree" TEXT,
    "systemServerCoreCount" INTEGER,
    "systemServerArch" TEXT,
    "systemTmpFolderSize" INTEGER,
    "systemLogFolderSize" INTEGER,
    "systemHeapMaxSize" INTEGER,
    "systemHeapSize" INTEGER,
    "systemUptime" INTEGER,
    CONSTRAINT "StatisticsHistory_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StatisticsHistory_httpResponseId_fkey" FOREIGN KEY ("httpResponseId") REFERENCES "HTTPResponse" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MonitorHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "environmentId" INTEGER NOT NULL,
    "httpResponseId" INTEGER NOT NULL,
    "analytics" TEXT,
    "licenseServer" TEXT,
    "mailServer" TEXT,
    "solrServer" TEXT,
    "viewer" TEXT,
    "openOffice" TEXT,
    "realTime" TEXT,
    "MSOffice" TEXT,
    CONSTRAINT "MonitorHistory_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MonitorHistory_httpResponseId_fkey" FOREIGN KEY ("httpResponseId") REFERENCES "HTTPResponse" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MonitorHistory" ("environmentId", "id") SELECT "environmentId", "id" FROM "MonitorHistory";
DROP TABLE "MonitorHistory";
ALTER TABLE "new_MonitorHistory" RENAME TO "MonitorHistory";
CREATE UNIQUE INDEX "MonitorHistory_httpResponseId_key" ON "MonitorHistory"("httpResponseId");
CREATE TABLE "new_Environment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "release" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "logCreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logUpdateAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logDeleted" BOOLEAN NOT NULL DEFAULT false,
    "logDeletedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "favoritedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Environment" ("baseUrl", "id", "isFavorite", "kind", "logCreatedAt", "logDeleted", "logUpdateAt", "name", "release") SELECT "baseUrl", "id", "isFavorite", "kind", "logCreatedAt", "logDeleted", "logUpdateAt", "name", "release" FROM "Environment";
DROP TABLE "Environment";
ALTER TABLE "new_Environment" RENAME TO "Environment";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "HTTPResponse_environmentId_key" ON "HTTPResponse"("environmentId");

-- CreateIndex
CREATE UNIQUE INDEX "LicenceHistory_httpResponseId_key" ON "LicenceHistory"("httpResponseId");

-- CreateIndex
CREATE UNIQUE INDEX "StatisticsHistory_httpResponseId_key" ON "StatisticsHistory"("httpResponseId");
