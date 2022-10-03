/*
  Warnings:

  - You are about to drop the column `oAuthKeys` on the `Environment` table. All the data in the column will be lost.
  - You are about to drop the column `updateScheduleId` on the `Environment` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "EnvironmentAuthKeys" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "payload" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "environmentId" INTEGER NOT NULL,
    CONSTRAINT "EnvironmentAuthKeys_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UpdateSchedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "frequency" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "onlyOnWorkDays" BOOLEAN NOT NULL DEFAULT false,
    "environmentId" INTEGER NOT NULL,
    CONSTRAINT "UpdateSchedule_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UpdateSchedule" ("environmentId", "frequency", "from", "id", "onlyOnWorkDays", "to") SELECT "environmentId", "frequency", "from", "id", "onlyOnWorkDays", "to" FROM "UpdateSchedule";
DROP TABLE "UpdateSchedule";
ALTER TABLE "new_UpdateSchedule" RENAME TO "UpdateSchedule";
CREATE UNIQUE INDEX "UpdateSchedule_environmentId_key" ON "UpdateSchedule"("environmentId");
CREATE TABLE "new_Environment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "release" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "logCreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logUpdateAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logDeleted" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Environment" ("baseUrl", "id", "kind", "logCreatedAt", "logDeleted", "logUpdateAt", "name", "release") SELECT "baseUrl", "id", "kind", "logCreatedAt", "logDeleted", "logUpdateAt", "name", "release" FROM "Environment";
DROP TABLE "Environment";
ALTER TABLE "new_Environment" RENAME TO "Environment";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "EnvironmentAuthKeys_environmentId_key" ON "EnvironmentAuthKeys"("environmentId");
