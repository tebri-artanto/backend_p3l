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

  module.exports = {
    getTransaksiFasilitasByReservasiId,
  };