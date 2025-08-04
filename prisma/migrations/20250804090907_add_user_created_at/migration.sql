-- DropIndex
DROP INDEX "_StoryToTag_B_index";

-- DropIndex
DROP INDEX "_StoryToTag_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_StoryToTag";
PRAGMA foreign_keys=on;

UPDATE "Story"
SET "slug" = LOWER(REPLACE("title", ' ', '-') || '-' || id);


-- CreateTable
CREATE TABLE "_StoryTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_StoryTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Story" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_StoryTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Story" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "coverImage" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" INTEGER,
    CONSTRAINT "Story_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Story" ("approved", "authorId", "category", "coverImage", "createdAt", "id", "language", "region", "slug", "sourceUrl", "text", "title") SELECT "approved", "authorId", "category", "coverImage", "createdAt", "id", "language", "region", "slug", "sourceUrl", "text", "title" FROM "Story";
DROP TABLE "Story";
ALTER TABLE "new_Story" RENAME TO "Story";
CREATE UNIQUE INDEX "Story_slug_key" ON "Story"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_StoryTags_AB_unique" ON "_StoryTags"("A", "B");

-- CreateIndex
CREATE INDEX "_StoryTags_B_index" ON "_StoryTags"("B");
