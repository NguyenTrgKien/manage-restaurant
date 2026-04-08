/*
  Warnings:

  - Added the required column `status` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CustomerStatus" AS ENUM ('inactive', 'active');

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "isBanned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "CustomerStatus" NOT NULL;
