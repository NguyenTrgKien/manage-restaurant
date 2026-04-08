/*
  Warnings:

  - You are about to drop the column `productId` on the `InventoryIssueItem` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `InventoryReceiptItem` table. All the data in the column will be lost.
  - Added the required column `foodId` to the `InventoryIssueItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foodId` to the `InventoryReceiptItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InventoryIssueItem" DROP CONSTRAINT "InventoryIssueItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryReceiptItem" DROP CONSTRAINT "InventoryReceiptItem_productId_fkey";

-- AlterTable
ALTER TABLE "InventoryIssueItem" DROP COLUMN "productId",
ADD COLUMN     "foodId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "InventoryReceiptItem" DROP COLUMN "productId",
ADD COLUMN     "foodId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "InventoryReceiptItem" ADD CONSTRAINT "InventoryReceiptItem_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryIssueItem" ADD CONSTRAINT "InventoryIssueItem_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
