-- AlterTable
ALTER TABLE `category` ADD COLUMN `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `todo` ADD COLUMN `updated_at` TIMESTAMP(1) NOT NULL DEFAULT CURRENT_TIMESTAMP(1),
    MODIFY `created_at` TIMESTAMP(1) NOT NULL DEFAULT CURRENT_TIMESTAMP(1);

-- AlterTable
ALTER TABLE `user` ADD COLUMN `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);