-- AlterTable
ALTER TABLE `ApiKey` MODIFY `truncatedKey` TEXT NULL,
    MODIFY `name` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `LynxHomeworkExists` MODIFY `superID` TEXT NOT NULL,
    MODIFY `title` MEDIUMTEXT NOT NULL,
    MODIFY `forumChannelID` TEXT NOT NULL,
    MODIFY `forumID` TEXT NOT NULL,
    MODIFY `guilID` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `passwordHash` LONGTEXT NOT NULL,
    MODIFY `displayName` LONGTEXT NULL,
    MODIFY `lynxKey` TEXT NULL,
    MODIFY `discordUserId` TEXT NULL;
