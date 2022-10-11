/*
  Warnings:

  - You are about to alter the column `connectedUsers` on the `StatisticsHistory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `dbSize` on the `StatisticsHistory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `dbTraficRecieved` on the `StatisticsHistory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `dbTraficSent` on the `StatisticsHistory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `memoryHeap` on the `StatisticsHistory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `nonMemoryHeap` on the `StatisticsHistory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `runtimeUptime` on the `StatisticsHistory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `systemHeapMaxSize` on the `StatisticsHistory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `systemHeapSize` on the `StatisticsHistory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `systemLogFolderSize` on the `StatisticsHistory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `systemServerMemoryFree` on the `StatisticsHistory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `systemServerMemorySize` on the `StatisticsHistory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `systemTmpFolderSize` on the `StatisticsHistory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `systemUptime` on the `StatisticsHistory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `threadingCount` on the `StatisticsHistory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `threadingDaemonCount` on the `StatisticsHistory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `threadingPeakCount` on the `StatisticsHistory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `threadingTotalStarted` on the `StatisticsHistory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

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
    "connectedUsers" BIGINT,
    "memoryHeap" BIGINT,
    "nonMemoryHeap" BIGINT,
    "dbTraficRecieved" BIGINT,
    "dbTraficSent" BIGINT,
    "dbSize" BIGINT,
    "artifactsApps" TEXT,
    "artifactsCore" TEXT,
    "artifactsSystem" TEXT,
    "externalConverter" BOOLEAN,
    "runtimeStart" DATETIME,
    "runtimeUptime" BIGINT,
    "threadingCount" BIGINT,
    "threadingPeakCount" BIGINT,
    "threadingDaemonCount" BIGINT,
    "threadingTotalStarted" BIGINT,
    "detailedMemory" TEXT,
    "systemServerMemorySize" BIGINT,
    "systemServerMemoryFree" BIGINT,
    "systemServerHDSize" TEXT,
    "systemServerHDFree" TEXT,
    "systemServerCoreCount" INTEGER,
    "systemServerArch" TEXT,
    "systemTmpFolderSize" BIGINT,
    "systemLogFolderSize" BIGINT,
    "systemHeapMaxSize" BIGINT,
    "systemHeapSize" BIGINT,
    "systemUptime" BIGINT,
    CONSTRAINT "StatisticsHistory_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StatisticsHistory_httpResponseId_fkey" FOREIGN KEY ("httpResponseId") REFERENCES "HTTPResponse" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_StatisticsHistory" ("artifactsApps", "artifactsCore", "artifactsSystem", "connectedUsers", "dataSourceFluigDs", "dataSourceFluigDsRo", "dbDriverName", "dbDriverVersion", "dbName", "dbSize", "dbTraficRecieved", "dbTraficSent", "dbVersion", "detailedMemory", "environmentId", "externalConverter", "httpResponseId", "id", "memoryHeap", "nonMemoryHeap", "runtimeStart", "runtimeUptime", "systemHeapMaxSize", "systemHeapSize", "systemLogFolderSize", "systemServerArch", "systemServerCoreCount", "systemServerHDFree", "systemServerHDSize", "systemServerMemoryFree", "systemServerMemorySize", "systemTmpFolderSize", "systemUptime", "threadingCount", "threadingDaemonCount", "threadingPeakCount", "threadingTotalStarted") SELECT "artifactsApps", "artifactsCore", "artifactsSystem", "connectedUsers", "dataSourceFluigDs", "dataSourceFluigDsRo", "dbDriverName", "dbDriverVersion", "dbName", "dbSize", "dbTraficRecieved", "dbTraficSent", "dbVersion", "detailedMemory", "environmentId", "externalConverter", "httpResponseId", "id", "memoryHeap", "nonMemoryHeap", "runtimeStart", "runtimeUptime", "systemHeapMaxSize", "systemHeapSize", "systemLogFolderSize", "systemServerArch", "systemServerCoreCount", "systemServerHDFree", "systemServerHDSize", "systemServerMemoryFree", "systemServerMemorySize", "systemTmpFolderSize", "systemUptime", "threadingCount", "threadingDaemonCount", "threadingPeakCount", "threadingTotalStarted" FROM "StatisticsHistory";
DROP TABLE "StatisticsHistory";
ALTER TABLE "new_StatisticsHistory" RENAME TO "StatisticsHistory";
CREATE UNIQUE INDEX "StatisticsHistory_httpResponseId_key" ON "StatisticsHistory"("httpResponseId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
