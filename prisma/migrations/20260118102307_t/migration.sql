-- CreateTable
CREATE TABLE `LynxClearBatch` (
    `id` VARCHAR(191) NOT NULL,
    `guildId` VARCHAR(191) NOT NULL,
    `channelId` VARCHAR(191) NOT NULL,
    `moderatorId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LynxClearedMessage` (
    `id` VARCHAR(191) NOT NULL,
    `batchId` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `username` TEXT NOT NULL,
    `avatarUrl` TEXT NULL,
    `content` LONGTEXT NULL,
    `embeds` JSON NULL,
    `attachments` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `timestamp` DATETIME(3) NOT NULL,

    INDEX `LynxClearedMessage_batchId_idx`(`batchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LynxClearedMessage` ADD CONSTRAINT `LynxClearedMessage_batchId_fkey` FOREIGN KEY (`batchId`) REFERENCES `LynxClearBatch`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
