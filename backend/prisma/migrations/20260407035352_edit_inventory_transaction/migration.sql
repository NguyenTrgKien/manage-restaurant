-- AlterTable
ALTER TABLE "InventoryTransactions" ALTER COLUMN "type" DROP DEFAULT,
ALTER COLUMN "costPrice" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "InventoryTransactions_ingredientId_idx" ON "InventoryTransactions"("ingredientId");

-- CreateIndex
CREATE INDEX "InventoryTransactions_referenceType_referenceId_idx" ON "InventoryTransactions"("referenceType", "referenceId");

-- CreateIndex
CREATE INDEX "InventoryTransactions_createdAt_idx" ON "InventoryTransactions"("createdAt");
