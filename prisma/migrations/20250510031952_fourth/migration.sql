/*
  Warnings:

  - You are about to drop the column `products` on the `carts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `carts` DROP COLUMN `products`;

-- CreateTable
CREATE TABLE `products_on_carts` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `cartId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,

    UNIQUE INDEX `products_on_carts_productId_cartId_key`(`productId`, `cartId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products_on_carts` ADD CONSTRAINT `products_on_carts_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products_on_carts` ADD CONSTRAINT `products_on_carts_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `carts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
