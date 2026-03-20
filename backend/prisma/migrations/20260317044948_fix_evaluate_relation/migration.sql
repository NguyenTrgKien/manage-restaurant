/*
  Warnings:

  - You are about to drop the column `messageUser` on the `OrderTable` table. All the data in the column will be lost.
  - The `status` column on the `Table` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TableStatus" AS ENUM ('AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE');

-- DropIndex
DROP INDEX "Evaluate_userId_key";

-- AlterTable
ALTER TABLE "Evaluate" ADD COLUMN     "foodId" INTEGER,
ADD COLUMN     "orderId" INTEGER;

-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "publicId" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "cancelReason" TEXT,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "paidAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "foodName" TEXT;

-- AlterTable
ALTER TABLE "OrderTable" DROP COLUMN "messageUser",
ADD COLUMN     "cancelReason" TEXT,
ADD COLUMN     "note" TEXT;

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "publicId" TEXT;

-- AlterTable
ALTER TABLE "Table" DROP COLUMN "status",
ADD COLUMN     "status" "TableStatus" NOT NULL DEFAULT 'AVAILABLE';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "publicId" TEXT;

-- AddForeignKey
ALTER TABLE "Evaluate" ADD CONSTRAINT "Evaluate_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluate" ADD CONSTRAINT "Evaluate_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
