-- CreateTable
CREATE TABLE "Environment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "release" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "oAuthKeys" TEXT,
    "updateScheduleId" INTEGER
);

-- CreateTable
CREATE TABLE "UpdateSchedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "frequency" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "onlyOnWorkDays" BOOLEAN NOT NULL DEFAULT false,
    "environmentId" INTEGER NOT NULL,
    CONSTRAINT "UpdateSchedule_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment" ("updateScheduleId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MonitorHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "environmentId" TEXT NOT NULL,
    CONSTRAINT "MonitorHistory_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "APIResponse" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "endpoint" TEXT NOT NULL,
    "monitorigApiId" TEXT,
    "responseStatusCode" INTEGER NOT NULL,
    "responseBody" TEXT NOT NULL,
    "responseTimeMs" INTEGER NOT NULL,
    "monitorHistoryId" INTEGER,
    CONSTRAINT "APIResponse_monitorHistoryId_fkey" FOREIGN KEY ("monitorHistoryId") REFERENCES "MonitorHistory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Log" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Environment_updateScheduleId_key" ON "Environment"("updateScheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "UpdateSchedule_environmentId_key" ON "UpdateSchedule"("environmentId");

-- CreateIndex
CREATE UNIQUE INDEX "AppSetting_settingId_key" ON "AppSetting"("settingId");
