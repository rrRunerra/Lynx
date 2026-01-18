-- AlterTable
ALTER TABLE `LynxKickHistory` MODIFY `reason` LONGTEXT NOT NULL;

-- CreateTable
CREATE TABLE `LynxBanHistory` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `guildId` VARCHAR(191) NOT NULL,
    `moderator` VARCHAR(191) NOT NULL,
    `reason` LONGTEXT NOT NULL,
    `duration` INTEGER NOT NULL,
    `until` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
