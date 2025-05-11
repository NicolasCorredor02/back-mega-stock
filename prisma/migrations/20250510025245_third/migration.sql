/*
  Warnings:

  - You are about to drop the `products_on_carts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `products` to the `carts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `products_on_carts` DROP FOREIGN KEY `products_on_carts_cartId_fkey`;

-- DropForeignKey
ALTER TABLE `products_on_carts` DROP FOREIGN KEY `products_on_carts_productId_fkey`;

-- AlterTable
ALTER TABLE `carts` ADD COLUMN `products` JSON NOT NULL;

-- DropTable
DROP TABLE `products_on_carts`;
