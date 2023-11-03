-- CreateTable
CREATE TABLE `Tarif` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jenis_tarif` VARCHAR(191) NOT NULL,
    `besaran_tarif` INTEGER NOT NULL,
    `id_season` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Tarif` ADD CONSTRAINT `Tarif_id_season_fkey` FOREIGN KEY (`id_season`) REFERENCES `Season`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
