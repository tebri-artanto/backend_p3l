const httpStatus = require("http-status");
const Response = require("../Model/Response");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const reservasiPValidator = require("../Utils/reservasiPValidator");
const { number } = require("joi");

const getTarifByJenisKamar = async (req, res) => {
  try {
    const { jenis_kamar, jumlah } = req.body;
    const tarif = await prisma.tarif.findMany({
      where: {
        kamar: {
          jenis_kamar: jenis_kamar,
        },
      },
      take: Number(jumlah),
    });
    const tarifIds = tarif.map((item) => item.id);
    const response = new Response.Success(false, "Results found", tarifIds);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const getBesaranTarifByJenisKamar = async (req, res) => {
  try {
    const { jenis_kamar, jumlah } = req.body;
    const tarif = await prisma.tarif.findMany({
      where: {
        kamar: {
          jenis_kamar: jenis_kamar,
        },
      },
      take: Number(jumlah),
    });
    const tarifIds = tarif.map((item) => item.besaran_tarif);
    const response = new Response.Success(false, "Results found", tarifIds);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const makeReservasiPersonal = async (req, res) => {
  const { 
    jumlah_anak,
    jumlah_dewasa,
    tanggal_checkin,
    tanggal_checkout,
    create_by,
    id_customer,
    total_bayarReservasi,
  } = req.body;
  // const { tarif_ids, besaranTarifs } = req.body;
  //     const { error, value } = reservasiPValidator.validate(req.body);
  //   if (error) {
  //     return res.status(400).json({ msg: error.details[0].message });
  //   }
  try {
    let transactionId = generateTransactionId();
    let existingReservasi = await prisma.reservasi.findFirst({
      where: {
        booking_id: transactionId,
      },
    });
    while (existingReservasi) {
      transactionId = generateTransactionId();
      existingReservasi = await prisma.reservasi.findFirst({
        where: {
          booking_id: transactionId,
        },
      });
    }
    const customers = await prisma.customer.findFirst({
      where: {
        id: Number(id_customer),
      },
    });
    const pegawais = await prisma.pegawai.findFirst({
      where: {
        id: Number(1),
      },
    });
    const tanggal_pembayaran = 0;
    const tglpembayaran = tanggal_pembayaran
      ? new Date(tanggal_pembayaran)
      : null;
    const reservasis = await prisma.reservasi.create({
      data: {
        booking_id: transactionId,
        jumlah_anak: Number(jumlah_anak),
        jumlah_dewasa: Number(jumlah_dewasa),
        tanggal_checkin: new Date(tanggal_checkin),
        tanggal_checkout: new Date(tanggal_checkout),
        create_by: create_by,
        create_date: new Date(),
        status_reservasi: "Belum Dibayar",
        tanggal_pembayaran: new Date(tglpembayaran),
        total_bayarReservasi: Number(total_bayarReservasi),
        // id_customer: parseInt(id_customer),
        customer: {
          connect: {
            id: customers.id,
          },
        },
        pegawai: {
          connect: {
            id: pegawais.id,
          },
        },
      },
    });
    const lastInsertedId = reservasis.id;
    console.log(lastInsertedId);
    // let tarif_ids = [1, 3];
    // let besaranTarifs = [100000, 100000];
    console.log(typeof req.body.tarif_ids); // Check the type
    console.log(Array.isArray(req.body.tarif_ids)); // Check if it's an array
    console.log(req.body.tarif_ids);
    // console.log(req.body.tarif_ids)
    // console.log(req.body.besaran_tarifs)
    let tarifIds = req.body.tarif_ids;
    let besaranTarifs = req.body.besaran_tarifs;
    // let tarifIds = tarif_ids.map(Number);
    console.log(tarifIds);
    console.log(besaranTarifs);

    // Insert selected kamar id into transaksi kamar table
    for (let i = 0; i < tarifIds.length; i++) {
      await prisma.transaksiKamar.create({
        data: {
          id_tarif: tarifIds[i],
          id_reservasi: lastInsertedId,
          subtotal: besaranTarifs[i],
        },
      });
    }
    let fasilitasIds = req.body.fasilitas_ids;
    let jumlahFasilitas = req.body.jumlah_fasilitas;
    let hargaFasilitas = [];
    console.log(fasilitasIds);
    console.log(jumlahFasilitas);

    hargaFasilitas = await Promise.all(
      fasilitasIds.map(async (item) => {
        const fasilitas = await prisma.fasilitasTambahan.findFirst({
          where: {
            id: item,
          },
        });
        return fasilitas.harga;
      })
    );
    console.log(hargaFasilitas);

    for (let i = 0; i < fasilitasIds.length; i++) {
      await prisma.transaksiFasilitas.create({
        data: {
          id_fasilitas: fasilitasIds[i],
          id_reservasi: lastInsertedId,
          jumlah: jumlahFasilitas[i],
          subtotal: jumlahFasilitas[i] * hargaFasilitas[i],
          tanggal_pemesanan: new Date(),
        },
      });
    }

    const response = new Response.Success(
      false,
      "Reservasi created successfully",
      reservasis
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const makeReservasiGroup = async (req, res) => {
    const {
      jumlah_anak,
      jumlah_dewasa,
      tanggal_checkin,
      tanggal_checkout,
      create_by,
      id_customer,
      id_pegawai,
      total_bayarReservasi,
    } = req.body;
    // const { tarif_ids, besaranTarifs } = req.body;
    //     const { error, value } = reservasiPValidator.validate(req.body);
    //   if (error) {
    //     return res.status(400).json({ msg: error.details[0].message });
    //   }
    try {
      let transactionId = generateTransactionIdGroup();
      let existingReservasi = await prisma.reservasi.findFirst({
        where: {
          booking_id: transactionId,
        },
      });
      while (existingReservasi) {
        transactionId = generateTransactionIdGroup();
        existingReservasi = await prisma.reservasi.findFirst({
          where: {
            booking_id: transactionId,
          },
        });
      }
      const customers = await prisma.customer.findFirst({
        where: {
          id: Number(id_customer),
        },
      });
      const pegawais = await prisma.pegawai.findFirst({
        where: {
          id: Number(id_pegawai),
        },
      });
      const tanggal_pembayaran = 0;
      const tglpembayaran = tanggal_pembayaran
        ? new Date(tanggal_pembayaran)
        : null;
      const reservasis = await prisma.reservasi.create({
        data: {
          booking_id: transactionId,
          jumlah_anak: Number(jumlah_anak),
          jumlah_dewasa: Number(jumlah_dewasa),
          tanggal_checkin: new Date(tanggal_checkin),
          tanggal_checkout: new Date(tanggal_checkout),
          create_by,
          create_date: new Date(),
          status_reservasi: "Belum Dibayar",
          tanggal_pembayaran: new Date(tglpembayaran),
          total_bayarReservasi: Number(total_bayarReservasi),
          // id_customer: parseInt(id_customer),
          customer: {
            connect: {
              id: customers.id,
            },
          },
          pegawai: {
            connect: {
              id: id_pegawai,
            },
          },
        },
      });
      const lastInsertedId = reservasis.id;
      console.log(lastInsertedId);
      // let tarif_ids = [1, 3];
      // let besaranTarifs = [100000, 100000];
      console.log(typeof req.body.tarif_ids); // Check the type
      console.log(Array.isArray(req.body.tarif_ids)); // Check if it's an array
      console.log(req.body.tarif_ids);
      // console.log(req.body.tarif_ids)
      // console.log(req.body.besaran_tarifs)
      let tarifIds = req.body.tarif_ids;
      let besaranTarifs = req.body.besaran_tarifs;
      // let tarifIds = tarif_ids.map(Number);
      console.log(tarifIds);
      console.log(besaranTarifs);
  
      // Insert selected kamar id into transaksi kamar table
      for (let i = 0; i < tarifIds.length; i++) {
        await prisma.transaksiKamar.create({
          data: {
            id_tarif: tarifIds[i],
            id_reservasi: lastInsertedId,
            subtotal: besaranTarifs[i],
          },
        });
      }
      let fasilitasIds = req.body.fasilitas_ids;
      let jumlahFasilitas = req.body.jumlah_fasilitas;
      let hargaFasilitas = [];
      console.log(fasilitasIds);
      console.log(jumlahFasilitas);
  
      hargaFasilitas = await Promise.all(
        fasilitasIds.map(async (item) => {
          const fasilitas = await prisma.fasilitasTambahan.findFirst({
            where: {
              id: item,
            },
          });
          return fasilitas.harga;
        })
      );
      console.log(hargaFasilitas);
      let todayDate = new Date();
  
      for (let i = 0; i < fasilitasIds.length; i++) {
        await prisma.transaksiFasilitas.create({
          data: {
            id_fasilitas: fasilitasIds[i],
            id_reservasi: lastInsertedId,
            jumlah: jumlahFasilitas[i],
            subtotal: jumlahFasilitas[i] * hargaFasilitas[i],
            tanggal_pemesanan: todayDate,
          },
        });
      }
  
      const response = new Response.Success(
        false,
        "Reservasi created successfully",
        reservasis
      );
      res.status(httpStatus.OK).json(response);
    } catch (error) {
      const response = new Response.Error(true, error.message);
      res.status(httpStatus.BAD_REQUEST).json(response);
    }
  };

const getReservasi = async (req, res) => {
  try {
    const reservasi = await prisma.reservasi.findMany({
      include: {
        customer: true,
      },
    });
    const response = new Response.Success(false, "Results found", reservasi);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const getReservasiById = async (req, res) => {
  try {
    const response = await prisma.reservasi.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        customer: true,
      },
    });
    res.status(200).json({
      status: "success",
      message: "Data fetched successfully",
      data: response,
    });
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const updateReservasi = async (req, res) => {
  const { status_reservasi, tanggal_pembayaran } = req.body;

  try {
    const reservasi = await prisma.reservasi.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        status_reservasi: status_reservasi,
        tanggal_pembayaran: tanggal_pembayaran,
      },
    });

    const response = new Response.Success(
      false,
      "Data edited successfully",
      reservasi
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const deleteReservasi = async (req, res) => {
  try {
    const reservasi = await prisma.reservasi.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    const response = new Response.Success(
      false,
      "Data deleted successfully",
      reservasi
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const generateTransactionId = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().substr(-2);
  const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  const day = ("0" + currentDate.getDate()).slice(-2);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `P${day}${month}${year}-${random}`;
};

const generateTransactionIdGroup = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().substr(-2);
    const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    const day = ("0" + currentDate.getDate()).slice(-2);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
  
    return `G${day}${month}${year}-${random}`;
  };
module.exports = {
  generateTransactionId,
  getReservasi,
  getReservasiById,
  deleteReservasi,
  updateReservasi,
  makeReservasiPersonal,
  getTarifByJenisKamar,
  getBesaranTarifByJenisKamar,
  makeReservasiGroup
};
