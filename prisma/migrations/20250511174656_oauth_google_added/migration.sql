-- AlterTable
ALTER TABLE `users` ADD COLUMN `platform` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `password` VARCHAR(191) NULL,
    MODIFY `last_name` VARCHAR(191) NULL,
    MODIFY `phone` VARCHAR(191) NULL;
