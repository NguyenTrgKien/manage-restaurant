/*
  Warnings:

  - You are about to drop the column `orderId` on the `Evaluate` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Evaluate` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Order` table. All the data in the column will be lost.
  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `userId` on the `OrderTable` table. All the data in the column will be lost.
  - The `status` column on the `OrderTable` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `customerId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderTableStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PAID', 'CANCELLED', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "Evaluate" DROP CONSTRAINT "Evaluate_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Evaluate" DROP CONSTRAINT "Evaluate_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrderTable" DROP CONSTRAINT "OrderTable_userId_fkey";

-- AlterTable
ALTER TABLE "Evaluate" DROP COLUMN "orderId",
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "userId",
ADD COLUMN     "customerId" INTEGER NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "OrderTable" DROP COLUMN "userId",
ADD COLUMN     "createByUserId" INTEGER,
ADD COLUMN     "customerId" INTEGER,
DROP COLUMN "status",
ADD COLUMN     "status" "OrderTableStatus" NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "OrderTable" ADD CONSTRAINT "OrderTable_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderTable" ADD CONSTRAINT "OrderTable_createByUserId_fkey" FOREIGN KEY ("createByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
