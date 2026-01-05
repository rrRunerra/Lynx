/*
  Warnings:

  - You are about to drop the `HomeWorkChannels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HomeworkExists` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RngRigConfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `HomeWorkChannels`;

-- DropTable
DROP TABLE `HomeworkExists`;

-- DropTable
DROP TABLE `RngRigConfig`;

-- CreateTable
CREATE TABLE `LynxHomeworkExists` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `superID` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `forumChannelID` VARCHAR(191) NOT NULL,
    `forumID` VARCHAR(191) NOT NULL,
    `guilID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LynxHomeWorkChannels` (
    `guildId` VARCHAR(191) NOT NULL,
    `channels` JSON NOT NULL,

    PRIMARY KEY (`guildId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LynxRngRigConfig` (
    `id` VARCHAR(191) NOT NULL,
    `ignoredNumbers` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
