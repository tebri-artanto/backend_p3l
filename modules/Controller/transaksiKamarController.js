const httpStatus = require("http-status");
const Response = require("../Model/Response");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getTransaksiKamar = async (req, res) => {
  try {
    const transaksiKamar = await prisma.transaksiKamar.findMany();
    const response = new Response.Success(
      false,
      "Results found",
      transaksiKamar
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const getTransaksiKamarById = async (req, res) => {
  try {
    const response = await prisma.transaksiKamar.findUnique({
      where: {
        id: Number(req.params.id),
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

const createTransaksiKamar = async (req, res) => {
  const { besaran_transaksiKamar, id_season, id_kamar } = req.body;
  const { error, value } = transaksiKamarValidator.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  const existingUser = await prisma.transaksiKamar.findFirst({
    where: {
      OR: [{ besaran_transaksiKamar: Number(besaran_transaksiKamar) }],
    },
  });

  if (existingUser) {
    const response = new Response.Error(true, "TransaksiKamar already exists");
    return res.status(httpStatus.BAD_REQUEST).json(response);
  }

  try {
    const transaksiKamar = await prisma.transaksiKamar.create({
      data: {
        besaran_transaksiKamar: Number(besaran_transaksiKamar),
        id_season: Number(id_season),
        id_kamar: Number(id_kamar),
      },
    });

    const response = new Response.Success(
      false,
      "Data inserted successfully",
      transaksiKamar
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const updateTransaksiKamar = async (req, res) => {
  const { besaran_transaksiKamar, id_season, id_kamar } = req.body;
  const { error, value } = transaksiKamarValidator.validate(req.body);

  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  try {
    const transaksiKamar = await prisma.transaksiKamar.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        besaran_transaksiKamar: Number(besaran_transaksiKamar),
        id_season: Number(id_season),
        id_kamar: Number(id_kamar),
      },
    });

    const response = new Response.Success(
      false,
      "Data edited successfully",
      transaksiKamar
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const deleteTransaksiKamar = async (req, res) => {
  try {
    const transaksiKamar = await prisma.transaksiKamar.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    const response = new Response.Success(
      false,
      "Data deleted successfully",
      transaksiKamar
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};
const getTransaksiKamarBySeasonId = async (req, res) => {
  try {
    const transaksiKamar = await prisma.transaksiKamar.findMany({
      where: {
        id_season: Number(req.params.id_season),
      },
    });
    const response = new Response.Success(
      false,
      "Data retrieved successfully",
      transaksiKamar
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const getKamarByReservasiId = async (req, res) => {
  try {
    const transksiKamar = await prisma.transaksiKamar.findFirst({
      where: {
        id_reservasi: Number(req.params.id),
      },
      include: {
        tarif: {
          include: {
            kamar: true,
          },
        },
      },
    });
    const response = new Response.Success(
      false,
      "Data retrieved successfully",
      transksiKamar
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const getTransaksiKamarAndKamarBySeasonId = async (req, res) => {
  try {
    const transaksiKamar = await prisma.transaksiKamar.findMany({
      where: {
        id_season: Number(req.params.id_season),
      },
      include: {
        kamar: true,
      },
    });
    const response = new Response.Success(
      false,
      "Data retrieved successfully",
      transaksiKamar
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const getTransaksiKamarByKamarId = async (req, res) => {
  try {
    const transaksiKamar = await prisma.transaksiKamar.findFist({
      where: {
        id_season: Number(req.params.id_season),
      },
    });
    const response = new Response.Success(
      false,
      "Data retrieved successfully",
      transaksiKamar
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

module.exports = {
  getKamarByReservasiId,
};
