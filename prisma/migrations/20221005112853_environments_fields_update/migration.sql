/*
  Warnings:

  - You are about to alter the column `dbTraficRecieved` on the `StatisticsHistory` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `dbTraficSent` on the `StatisticsHistory` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StatisticsHistory" (
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
    "dbTraficRecieved" INTEGER,
    "dbTraficSent" INTEGER,
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
INSERT INTO "new_StatisticsHistory" ("artifactsApps", "artifactsCore", "artifactsSystem", "connectedUsers", "dataSourceFluigDs", "dataSourceFluigDsRo", "dbDriverName", "dbDriverVersion", "dbName", "dbSize", "dbTraficRecieved", "dbTraficSent", "dbVersion", "detailedMemory", "environmentId", "externalConverter", "httpResponseId", "id", "memoryHeap", "nonMemoryHeap", "runtimeStart", "runtimeUptime", "systemHeapMaxSize", "systemHeapSize", "systemLogFolderSize", "systemServerArch", "systemServerCoreCount", "systemServerHDFree", "systemServerHDSize", "systemServerMemoryFree", "systemServerMemorySize", "systemTmpFolderSize", "systemUptime", "threadingCount", "threadingDaemonCount", "threadingPeakCount", "threadingTotalStarted") SELECT "artifactsApps", "artifactsCore", "artifactsSystem", "connectedUsers", "dataSourceFluigDs", "dataSourceFluigDsRo", "dbDriverName", "dbDriverVersion", "dbName", "dbSize", "dbTraficRecieved", "dbTraficSent", "dbVersion", "detailedMemory", "environmentId", "externalConverter", "httpResponseId", "id", "memoryHeap", "nonMemoryHeap", "runtimeStart", "runtimeUptime", "systemHeapMaxSize", "systemHeapSize", "systemLogFolderSize", "systemServerArch", "systemServerCoreCount", "systemServerHDFree", "systemServerHDSize", "systemServerMemoryFree", "systemServerMemorySize", "systemTmpFolderSize", "systemUptime", "threadingCount", "threadingDaemonCount", "threadingPeakCount", "threadingTotalStarted" FROM "StatisticsHistory";
DROP TABLE "StatisticsHistory";
ALTER TABLE "new_StatisticsHistory" RENAME TO "StatisticsHistory";
CREATE UNIQUE INDEX "StatisticsHistory_httpResponseId_key" ON "StatisticsHistory"("httpResponseId");
CREATE TABLE "new_Environment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "release" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "logCreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logUpdateAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logDeleted" BOOLEAN NOT NULL DEFAULT false,
    "logDeletedAt" DATETIME,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "favoritedAt" DATETIME
);
INSERT INTO "new_Environment" ("baseUrl", "favoritedAt", "id", "isFavorite", "kind", "logCreatedAt", "logDeleted", "logDeletedAt", "logUpdateAt", "name", "release") SELECT "baseUrl", "favoritedAt", "id", "isFavorite", "kind", "logCreatedAt", "logDeleted", "logDeletedAt", "logUpdateAt", "name", "release" FROM "Environment";
DROP TABLE "Environment";
ALTER TABLE "new_Environment" RENAME TO "Environment";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
