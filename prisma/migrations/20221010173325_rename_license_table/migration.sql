/*
  Warnings:

  - You are about to drop the `LicenceHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "LicenceHistory";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "licenseHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "environmentId" INTEGER NOT NULL,
    "httpResponseId" INTEGER NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "activeUsers" INTEGER NOT NULL,
    "totalLicenses" INTEGER NOT NULL,
    "remainingLicenses" INTEGER NOT NULL,
    CONSTRAINT "licenseHistory_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "licenseHistory_httpResponseId_fkey" FOREIGN KEY ("httpResponseId") REFERENCES "HTTPResponse" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "licenseHistory_httpResponseId_key" ON "licenseHistory"("httpResponseId");
