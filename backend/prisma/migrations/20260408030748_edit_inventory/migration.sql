/*
  Warnings:

  - You are about to drop the column `costPrice` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `minQuantity` on the `Inventory` table. All the data in the column will be lost.
  - Added the required column `avgPrice` to the `Inventory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "costPrice",
DROP COLUMN "minQuantity",
ADD COLUMN     "avgPrice" DECIMAL(10,3) NOT NULL,
ALTER COLUMN "lastUpdatedAt" DROP DEFAULT;
