/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Story` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Story" ADD COLUMN "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Story_slug_key" ON "Story"("slug");
