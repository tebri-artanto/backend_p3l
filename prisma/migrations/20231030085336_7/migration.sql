/*
  Warnings:

  - Added the required column `id_role` to the `Akun` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Akun` ADD COLUMN `id_role` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_role` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Akun` ADD CONSTRAINT `Akun_id_role_fkey` FOREIGN KEY (`id_role`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
