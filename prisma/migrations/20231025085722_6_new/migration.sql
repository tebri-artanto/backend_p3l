-- CreateTable
CREATE TABLE `Akun` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `no_identitas` VARCHAR(191) NOT NULL,
    `no_telp` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `nama_istitusi` VARCHAR(191) NOT NULL,
    `id_akun` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pegawai` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_pegawai` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `id_akun` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_id_akun_fkey` FOREIGN KEY (`id_akun`) REFERENCES `Akun`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pegawai` ADD CONSTRAINT `Pegawai_id_akun_fkey` FOREIGN KEY (`id_akun`) REFERENCES `Akun`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
