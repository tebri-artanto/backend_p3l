-- CreateTable
CREATE TABLE `Season` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_season` VARCHAR(191) NOT NULL,
    `jenis_season` VARCHAR(191) NOT NULL,
    `tanggal_mulai` DATE NOT NULL,
    `tanggal_selesai` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tarif` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `besaran_tarif` INTEGER NOT NULL,
    `id_season` INTEGER NOT NULL,
    `id_kamar` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FasilitasTambahan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_fasilitas` VARCHAR(191) NOT NULL,
    `harga` INTEGER NOT NULL,
    `stock` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Akun` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `id_role` INTEGER NOT NULL,

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
    `nama_institusi` VARCHAR(191) NOT NULL,
    `id_akun` INTEGER NOT NULL,
    `create_at` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pegawai` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_pegawai` VARCHAR(191) NOT NULL,
    `id_akun` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_role` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kamar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `no_kamar` VARCHAR(191) NOT NULL,
    `kapasitas` INTEGER NOT NULL,
    `jenis_bed` VARCHAR(191) NOT NULL,
    `jenis_kamar` VARCHAR(191) NOT NULL,
    `luas_kamar` VARCHAR(191) NOT NULL,
    `fasilitas` VARCHAR(191) NOT NULL,
    `status_ketersediaan` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reservasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `booking_id` VARCHAR(191) NOT NULL,
    `jumlah_anak` INTEGER NOT NULL,
    `jumlah_dewasa` INTEGER NOT NULL,
    `tanggal_checkin` DATE NOT NULL,
    `tanggal_checkout` DATE NOT NULL,
    `create_by` VARCHAR(191) NOT NULL,
    `create_date` DATE NOT NULL,
    `status_reservasi` VARCHAR(191) NOT NULL,
    `tanggal_pembayaran` DATE NULL,
    `id_customer` INTEGER NULL,
    `id_pegawai` INTEGER NULL,
    `total_bayarReservasi` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TransaksiKamar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_reservasi` INTEGER NOT NULL,
    `id_tarif` INTEGER NOT NULL,
    `subtotal` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TransaksiFasilitas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_reservasi` INTEGER NOT NULL,
    `id_fasilitas` INTEGER NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `subtotal` INTEGER NOT NULL,
    `tanggal_pemesanan` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoicePelunasan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `no_invoice` VARCHAR(191) NOT NULL,
    `tgl_invoice` DATE NOT NULL,
    `front_office` VARCHAR(191) NOT NULL,
    `total_tax` INTEGER NOT NULL,
    `total_harga` INTEGER NOT NULL,
    `total_jaminan` INTEGER NOT NULL,
    `total_deposit` INTEGER NOT NULL,
    `total_pelunasan` INTEGER NOT NULL,
    `id_reservasi` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Tarif` ADD CONSTRAINT `Tarif_id_kamar_fkey` FOREIGN KEY (`id_kamar`) REFERENCES `Kamar`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tarif` ADD CONSTRAINT `Tarif_id_season_fkey` FOREIGN KEY (`id_season`) REFERENCES `Season`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Akun` ADD CONSTRAINT `Akun_id_role_fkey` FOREIGN KEY (`id_role`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_id_akun_fkey` FOREIGN KEY (`id_akun`) REFERENCES `Akun`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pegawai` ADD CONSTRAINT `Pegawai_id_akun_fkey` FOREIGN KEY (`id_akun`) REFERENCES `Akun`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservasi` ADD CONSTRAINT `Reservasi_id_customer_fkey` FOREIGN KEY (`id_customer`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservasi` ADD CONSTRAINT `Reservasi_id_pegawai_fkey` FOREIGN KEY (`id_pegawai`) REFERENCES `Pegawai`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransaksiKamar` ADD CONSTRAINT `TransaksiKamar_id_reservasi_fkey` FOREIGN KEY (`id_reservasi`) REFERENCES `Reservasi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransaksiKamar` ADD CONSTRAINT `TransaksiKamar_id_tarif_fkey` FOREIGN KEY (`id_tarif`) REFERENCES `Tarif`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransaksiFasilitas` ADD CONSTRAINT `TransaksiFasilitas_id_reservasi_fkey` FOREIGN KEY (`id_reservasi`) REFERENCES `Reservasi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransaksiFasilitas` ADD CONSTRAINT `TransaksiFasilitas_id_fasilitas_fkey` FOREIGN KEY (`id_fasilitas`) REFERENCES `FasilitasTambahan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoicePelunasan` ADD CONSTRAINT `InvoicePelunasan_id_reservasi_fkey` FOREIGN KEY (`id_reservasi`) REFERENCES `Reservasi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
