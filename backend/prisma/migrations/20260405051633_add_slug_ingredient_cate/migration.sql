/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `IngredientCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `IngredientCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `IngredientCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IngredientCategory" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "IngredientCategory_slug_key" ON "IngredientCategory"("slug");
