/*
  Warnings:

  - You are about to drop the column `cost_price` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `food_id` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `last_update_at` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `max_quantity` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `min_quantity` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `foodId` on the `InventoryIssueItem` table. All the data in the column will be lost.
  - You are about to drop the column `foodId` on the `InventoryReceiptItem` table. All the data in the column will be lost.
  - You are about to drop the column `foodId` on the `InventoryTransactions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ingredientId]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `costPrice` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ingredientId` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastUpdatedAt` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxQuantity` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minQuantity` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ingredientId` to the `InventoryIssueItem` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `InventoryIssues` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `ingredientId` to the `InventoryReceiptItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ingredientId` to the `InventoryTransactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "IngredientUnit" AS ENUM ('KG', 'G', 'L', 'ML', 'UNIT');

-- CreateEnum
CREATE TYPE "InventoryIssueStatus" AS ENUM ('draft', 'completed', 'cancelled');

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_food_id_fkey";

-- DropForeignKey
ALTER TABLE "InventoryIssueItem" DROP CONSTRAINT "InventoryIssueItem_foodId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryReceiptItem" DROP CONSTRAINT "InventoryReceiptItem_foodId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryTransactions" DROP CONSTRAINT "InventoryTransactions_foodId_fkey";

-- DropIndex
DROP INDEX "Inventory_food_id_key";

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "cost_price",
DROP COLUMN "food_id",
DROP COLUMN "last_update_at",
DROP COLUMN "max_quantity",
DROP COLUMN "min_quantity",
ADD COLUMN     "costPrice" DECIMAL(10,3) NOT NULL,
ADD COLUMN     "ingredientId" INTEGER NOT NULL,
ADD COLUMN     "lastUpdatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "maxQuantity" INTEGER NOT NULL,
ADD COLUMN     "minQuantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "InventoryIssueItem" DROP COLUMN "foodId",
ADD COLUMN     "ingredientId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "InventoryIssues" DROP COLUMN "status",
ADD COLUMN     "status" "InventoryIssueStatus" NOT NULL;

-- AlterTable
ALTER TABLE "InventoryReceiptItem" DROP COLUMN "foodId",
ADD COLUMN     "ingredientId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "InventoryTransactions" DROP COLUMN "foodId",
ADD COLUMN     "ingredientId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "unit" "IngredientUnit" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" SERIAL NOT NULL,
    "foodId" INTEGER NOT NULL,
    "ingredientId" INTEGER NOT NULL,
    "quantity" DECIMAL(10,3) NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_foodId_ingredientId_key" ON "Recipe"("foodId", "ingredientId");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_ingredientId_key" ON "Inventory"("ingredientId");

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransactions" ADD CONSTRAINT "InventoryTransactions_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryReceiptItem" ADD CONSTRAINT "InventoryReceiptItem_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryIssueItem" ADD CONSTRAINT "InventoryIssueItem_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
