-- CreateEnum
CREATE TYPE "InventoryStatus" AS ENUM ('in_stock', 'low_stock', 'out_of_stock');

-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "status" "InventoryStatus" NOT NULL DEFAULT 'low_stock';
