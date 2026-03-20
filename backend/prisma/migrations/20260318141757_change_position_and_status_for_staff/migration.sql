/*
  Warnings:

  - You are about to drop the column `positionId` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the `Position` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Status` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "StaffPosition" AS ENUM ('MANAGER', 'WAITER', 'CHEF', 'CASHIER', 'SECURITY');

-- CreateEnum
CREATE TYPE "StaffStatus" AS ENUM ('WORKING', 'ON_LEAVE', 'RESIGNED');

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_positionId_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_statusId_fkey";

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "positionId",
DROP COLUMN "statusId",
ADD COLUMN     "position" "StaffPosition" NOT NULL DEFAULT 'WAITER',
ADD COLUMN     "status" "StaffStatus" NOT NULL DEFAULT 'WORKING';

-- DropTable
DROP TABLE "Position";

-- DropTable
DROP TABLE "Status";
