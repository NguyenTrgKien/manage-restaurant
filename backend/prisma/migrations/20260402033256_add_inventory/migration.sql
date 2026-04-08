/*
  Warnings:

  - You are about to drop the column `quantity` on the `Food` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SupplierStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "InventoryTransactionType" AS ENUM ('stock_in', 'stock_out');

-- CreateEnum
CREATE TYPE "InventoryTransactionReference" AS ENUM ('receipt', 'issue', 'order');

-- CreateEnum
CREATE TYPE "InventoryReceiptStatus" AS ENUM ('draft', 'completed', 'cancelled');

-- AlterTable
ALTER TABLE "Food" DROP COLUMN "quantity";

-- CreateTable
CREATE TABLE "Suppliers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT,
    "tax_code" TEXT,
    "status" "SupplierStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "food_id" INTEGER NOT NULL,
    "cost_price" DECIMAL(10,3) NOT NULL,
    "min_quantity" INTEGER NOT NULL,
    "max_quantity" INTEGER NOT NULL,
    "last_update_at" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryTransactions" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "foodId" INTEGER NOT NULL,
    "type" "InventoryTransactionType" NOT NULL DEFAULT 'stock_in',
    "costPrice" DECIMAL(10,3) NOT NULL,
    "beforeQuantity" INTEGER NOT NULL,
    "afterQuantity" INTEGER NOT NULL,
    "referenceType" "InventoryTransactionReference" NOT NULL DEFAULT 'receipt',
    "referenceId" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL,

    CONSTRAINT "InventoryTransactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryReceipts" (
    "id" SERIAL NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "receiptCode" TEXT NOT NULL,
    "receiptDate" TIMESTAMP(3) NOT NULL,
    "status" "InventoryReceiptStatus" NOT NULL,
    "totalAmount" DECIMAL(10,3) NOT NULL,
    "note" TEXT,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryReceipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryReceiptItem" (
    "id" SERIAL NOT NULL,
    "receiptId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "costPrice" DECIMAL(10,3) NOT NULL,
    "totalPrice" DECIMAL(10,3) NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryReceiptItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryIssues" (
    "id" SERIAL NOT NULL,
    "issueCode" TEXT NOT NULL,
    "issuedDate" TIMESTAMP(3) NOT NULL,
    "status" "InventoryReceiptStatus" NOT NULL,
    "note" TEXT,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryIssues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryIssueItem" (
    "id" SERIAL NOT NULL,
    "issueId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "costPrice" DECIMAL(10,3) NOT NULL,
    "totalPrice" DECIMAL(10,3) NOT NULL,

    CONSTRAINT "InventoryIssueItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Suppliers_email_key" ON "Suppliers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_food_id_key" ON "Inventory"("food_id");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryReceipts_receiptCode_key" ON "InventoryReceipts"("receiptCode");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryIssues_issueCode_key" ON "InventoryIssues"("issueCode");

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "Food"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransactions" ADD CONSTRAINT "InventoryTransactions_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransactions" ADD CONSTRAINT "InventoryTransactions_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryReceipts" ADD CONSTRAINT "InventoryReceipts_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryReceipts" ADD CONSTRAINT "InventoryReceipts_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryReceiptItem" ADD CONSTRAINT "InventoryReceiptItem_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "InventoryReceipts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryReceiptItem" ADD CONSTRAINT "InventoryReceiptItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryIssues" ADD CONSTRAINT "InventoryIssues_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryIssueItem" ADD CONSTRAINT "InventoryIssueItem_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "InventoryIssues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryIssueItem" ADD CONSTRAINT "InventoryIssueItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
