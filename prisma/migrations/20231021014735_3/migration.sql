-- CreateTable
CREATE TABLE `FasilitasTambahan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_fasilitas` VARCHAR(191) NOT NULL,
    `harga` INTEGER NOT NULL,
    `stock` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
