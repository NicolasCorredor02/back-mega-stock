/*
  Warnings:

  - Made the column `image_profile` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `id_number` VARCHAR(191) NOT NULL,
    MODIFY `image_profile` VARCHAR(191) NOT NULL;
