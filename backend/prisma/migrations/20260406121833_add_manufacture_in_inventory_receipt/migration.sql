/*
  Warnings:

  - You are about to drop the column `costPrice` on the `InventoryReceiptItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[batchNumber]` on the table `InventoryReceiptItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ingredientId,batchNumber]` on the table `InventoryReceiptItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expiryAt` to the `InventoryReceiptItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `manufactureDate` to the `InventoryReceiptItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `InventoryReceiptItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InventoryReceiptItem" DROP COLUMN "costPrice",
ADD COLUMN     "expiryAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "manufactureDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "unitPrice" DECIMAL(10,3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "InventoryReceiptItem_batchNumber_key" ON "InventoryReceiptItem"("batchNumber");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryReceiptItem_ingredientId_batchNumber_key" ON "InventoryReceiptItem"("ingredientId", "batchNumber");
