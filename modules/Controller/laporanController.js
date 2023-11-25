const httpStatus = require("http-status");
const Response = require("../Model/Response");
const bcrypt = require("../Utils/bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getLaporan1 = async (req, res) => {
  try {
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const customers = await prisma.customer.findMany();
    const customerData = months.map((month) => {
      const jumlah = customers.filter((customer) => {
        const createdAt = new Date(customer.create_at);
        return createdAt.getMonth() + 1 === months.indexOf(month) + 1;
      }).length;

      return {
        bulan: month,
        jumlah: jumlah,
      };
    });
    const response = new Response.Success(
      true,
      "Customer data retrieved successfully",
      customerData
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const getLaporan2 = async (req, res) => {
  try {
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const invoices = await prisma.invoicePelunasan.findMany();
    const laporanData = months.map((month) => {
      const grupTotal = invoices  
        .filter(
          (invoice) =>
            invoice.tgl_invoice.getMonth() + 1 === months.indexOf(month) + 1 &&
            invoice.no_invoice.startsWith("G")
        )
        .reduce((total, invoice) => total + invoice.total_harga, 0);

      const personalTotal = invoices
        .filter(
          (invoice) =>
            invoice.tgl_invoice.getMonth() + 1 === months.indexOf(month) + 1 &&
            invoice.no_invoice.startsWith("P")
        )
        .reduce((total, invoice) => total + invoice.total_harga, 0);

      return {
        bulan: month,
        Grup: grupTotal,
        Personal: personalTotal,
        Total: grupTotal + personalTotal,
      };  
    });
    const response = new Response.Success(
      true,
      "Laporan data retrieved successfully",
      laporanData
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

// const getLaporan3 = async (req, res) => {
//     try {
//         const reservasis = await prisma.reservasi.findMany({
//             include: {
//                 kamar: {
//                     select: {
//                         jenis_kamar: true
//                     }
//                 }
//             }
//         });
//         const jenisKamarData = {};
//         reservasis.forEach(reservasi => {
//             const jenisKamar = reservasi.kamar.jenis_kamar;
//             const bookingId = reservasi.booking_id;
//             const isGrup = bookingId.startsWith('G');
//             const isPersonal = bookingId.startsWith('P');

//             if (!jenisKamarData[jenisKamar]) {
//                 jenisKamarData[jenisKamar] = {
//                     jenisKamar: jenisKamar,
//                     Grup: 0,
//                     Personal: 0,
//                     Total: 0
//                 };
//             }

//             if (isGrup) {
//                 jenisKamarData[jenisKamar].Grup += 1;
//             }

//             if (isPersonal) {
//                 jenisKamarData[jenisKamar].Personal += 1;
//             }

//             jenisKamarData[jenisKamar].Total += 1;
//         });

//         const laporanData = Object.values(jenisKamarData);

//         const response = new Response.Success(
//             true,
//             'Laporan data retrieved successfully',
//             laporanData
//         );
//         res.status(httpStatus.OK).json(response);
//     } catch (error) {
//         const response = new Response.Error(true, error.message);
//         res.status(httpStatus.BAD_REQUEST).json(response);
//     }
// }

const getLaporan4 = async (req, res) => {
  try {
    const reservasis = await prisma.reservasi.findMany({
      include: {
        customer: true,
      },
    });

    const customerData = {};
    reservasis.forEach((reservasi) => {
      const customerName = reservasi.customer.nama;
      if (!customerData[customerName]) {
        customerData[customerName] = {
          nama: customerName,
          jumlahReservasi: 0,
          totalPembayaran: 0,
        };
      }
      customerData[customerName].jumlahReservasi += 1;
      customerData[customerName].totalPembayaran +=
        reservasi.total_bayarReservasi;
    });

    const laporanData = Object.values(customerData);

    // Sort the laporanData array by jumlahReservasi in descending order
    laporanData.sort((a, b) => b.jumlahReservasi - a.jumlahReservasi);

    // Return only the top 5 data
    const top5Data = laporanData.slice(0, 5);

    const response = new Response.Success(
      true,
      "Laporan data retrieved successfully",
      top5Data
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const getLaporan3 = async (req, res) => {
  try {
    const transactions = await prisma.transaksiKamar.findMany({
      include: {
        tarif: {
          include: {
            kamar: true,
          },
        },
        reservasi: true,
      },
    });

    const summary = transactions.reduce((acc, transaction) => {
      const jenisKamar = transaction.tarif.kamar.jenis_kamar;
      const bookingIdPrefix = transaction.reservasi.booking_id.charAt(0);

      // Initialize counters if not exists
      acc[jenisKamar] = acc[jenisKamar] || { Grup: 0, Personal: 0 };

      // Increment counters based on booking ID prefix
      if (bookingIdPrefix === "G") {
        acc[jenisKamar].Grup++;
      } else if (bookingIdPrefix === "P") {
        acc[jenisKamar].Personal++;
      }

      return acc;
    }, {});

    // Transform the data into the desired response format
    const response = Object.keys(summary).map((jenisKamar) => ({
      Jenis_kamar: jenisKamar,
      Grup: summary[jenisKamar].Grup,
      Personal: summary[jenisKamar].Personal,
      Total: summary[jenisKamar].Grup + summary[jenisKamar].Personal,
    }));

    res.json(response);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

module.exports = {
  getLaporan1,
  getLaporan2,
  getLaporan4,
  getLaporan3,
};
