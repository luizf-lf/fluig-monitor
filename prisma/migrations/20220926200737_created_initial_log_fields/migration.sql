/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Environment` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `Environment` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Notification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readed" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Notification" ("body", "createdAt", "id", "title", "type") SELECT "body", "createdAt", "id", "title", "type" FROM "Notification";
DROP TABLE "Notification";
ALTER TABLE "new_Notification" RENAME TO "Notification";
CREATE TABLE "new_Environment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "release" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "oAuthKeys" TEXT,
    "updateScheduleId" INTEGER,
    "logCreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logUpdateAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logDeleted" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Environment" ("baseUrl", "id", "kind", "name", "oAuthKeys", "release", "updateScheduleId") SELECT "baseUrl", "id", "kind", "name", "oAuthKeys", "release", "updateScheduleId" FROM "Environment";
DROP TABLE "Environment";
ALTER TABLE "new_Environment" RENAME TO "Environment";
CREATE UNIQUE INDEX "Environment_updateScheduleId_key" ON "Environment"("updateScheduleId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
