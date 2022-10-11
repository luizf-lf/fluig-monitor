-- CreateTable
CREATE TABLE "Environment" (
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

-- CreateTable
CREATE TABLE "EnvironmentAuthKeys" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "payload" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "environmentId" INTEGER NOT NULL,
    CONSTRAINT "EnvironmentAuthKeys_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UpdateSchedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "frequency" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "onlyOnWorkDays" BOOLEAN NOT NULL DEFAULT false,
    "environmentId" INTEGER NOT NULL,
    CONSTRAINT "UpdateSchedule_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HTTPResponse" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "environmentId" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endpoint" TEXT,
    "statusCode" INTEGER NOT NULL,
    "responseTimeMs" INTEGER NOT NULL,
    CONSTRAINT "HTTPResponse_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LicenseHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "environmentId" INTEGER NOT NULL,
    "httpResponseId" INTEGER NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "activeUsers" INTEGER NOT NULL,
    "totalLicenses" INTEGER NOT NULL,
    "remainingLicenses" INTEGER NOT NULL,
    CONSTRAINT "LicenseHistory_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LicenseHistory_httpResponseId_fkey" FOREIGN KEY ("httpResponseId") REFERENCES "HTTPResponse" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MonitorHistory" (
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

-- CreateTable
CREATE TABLE "AppSetting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "settingId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "group" TEXT
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readed" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Log" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "EnvironmentAuthKeys_environmentId_key" ON "EnvironmentAuthKeys"("environmentId");

-- CreateIndex
CREATE UNIQUE INDEX "UpdateSchedule_environmentId_key" ON "UpdateSchedule"("environmentId");

-- CreateIndex
CREATE UNIQUE INDEX "HTTPResponse_environmentId_key" ON "HTTPResponse"("environmentId");

-- CreateIndex
CREATE UNIQUE INDEX "LicenseHistory_httpResponseId_key" ON "LicenseHistory"("httpResponseId");

-- CreateIndex
CREATE UNIQUE INDEX "MonitorHistory_httpResponseId_key" ON "MonitorHistory"("httpResponseId");

-- CreateIndex
CREATE UNIQUE INDEX "StatisticsHistory_httpResponseId_key" ON "StatisticsHistory"("httpResponseId");

-- CreateIndex
CREATE UNIQUE INDEX "AppSetting_settingId_key" ON "AppSetting"("settingId");
