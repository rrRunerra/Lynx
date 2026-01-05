-- CreateTable
CREATE TABLE `RngRigConfig` (
    `id` VARCHAR(191) NOT NULL,
    `ignoredNumbers` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
