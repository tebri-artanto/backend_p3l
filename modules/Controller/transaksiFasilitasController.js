const httpStatus = require("http-status");
const Response = require("../Model/Response");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getTransaksiFasilitasByReservasiId = async (req, res) => {
    try {
      const transaksiFasilitas = await prisma.transaksiFasilitas.findMany({
        where: {
          id_reservasi: Number(req.params.id_reservasi),
        },
        include: {
          fasilitas: true,
        },
      });
      const response = new Response.Success(false, "Data retrieved successfully", transaksiFasilitas);
      res.status(httpStatus.OK).json(response);
    } catch (error) {
      const response = new Response.Error(true, error.message);
      res.status(httpStatus.BAD_REQUEST).json(response);
    }
  };

  const tambahTransaksiFasilitas = async (req, res) => {
    try {
      const { id_reservasi } = req.body;

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
            id_reservasi: id_reservasi,
            jumlah: jumlahFasilitas[i],
            subtotal: jumlahFasilitas[i] * hargaFasilitas[i],
            tanggal_pemesanan: new Date(),
          },
        });
      }

      const transaksiFasilitas = await prisma.transaksiFasilitas.findMany({
        where: {
          id_reservasi: Number(id_reservasi),
        },
        include: {
          fasilitas: true,
        },
      });

      const response = new Response.Success(false, "Data inserted successfully", transaksiFasilitas);
      res.status(httpStatus.CREATED).json(response);
    } catch (error) {
      const response = new Response.Error(true, error.message);
      res.status(httpStatus.BAD_REQUEST).json(response);
    }
  };

  module.exports = {
    getTransaksiFasilitasByReservasiId,
    tambahTransaksiFasilitas,
  };