/*
  Warnings:

  - A unique constraint covering the columns `[providerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Playlist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "vibeId" TEXT,
    "spotifyId" TEXT NOT NULL,
    "spotifyUrl" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "trackCount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Playlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Playlist_vibeId_fkey" FOREIGN KEY ("vibeId") REFERENCES "Vibe" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vibe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "inputText" TEXT NOT NULL,
    "normalizedKey" TEXT NOT NULL,
    "specJson" JSONB NOT NULL,
    "tracks" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vibe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Vibe" ("createdAt", "id", "inputText", "normalizedKey", "specJson", "tracks", "userId") SELECT "createdAt", "id", "inputText", "normalizedKey", "specJson", "tracks", "userId" FROM "Vibe";
DROP TABLE "Vibe";
ALTER TABLE "new_Vibe" RENAME TO "Vibe";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_spotifyId_key" ON "Playlist"("spotifyId");

-- CreateIndex
CREATE UNIQUE INDEX "User_providerId_key" ON "User"("providerId");
