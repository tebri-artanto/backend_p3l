-- CreateTable
CREATE TABLE `Kamar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `no_kamar` VARCHAR(191) NOT NULL,
    `jenis_kamar` VARCHAR(191) NOT NULL,
    `kapasitas` INTEGER NOT NULL,
    `jenis_bed` VARCHAR(191) NOT NULL,
    `luas_kamar` VARCHAR(191) NOT NULL,
    `fasilitas` VARCHAR(191) NOT NULL,
    `status_ketersediaan` BOOLEAN NOT NULL,
    `id_tarif` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Kamar` ADD CONSTRAINT `Kamar_id_tarif_fkey` FOREIGN KEY (`id_tarif`) REFERENCES `Tarif`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
