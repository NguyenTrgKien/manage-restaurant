/*
  Warnings:

  - You are about to drop the column `isAvailable` on the `Food` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Food" DROP COLUMN "isAvailable",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
