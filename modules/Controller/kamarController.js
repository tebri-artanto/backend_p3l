const httpStatus = require("http-status");
const Response = require("../Model/Response");
const kamarValidator = require("../Utils/kamarValidator");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getKamar = async (req, res) => {
  try {
    const kamar = await prisma.kamar.findMany();
    const response = new Response.Success(false, "Results found", kamar);
      res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const getKamarById = async (req, res) => {
  try {
    const response = await prisma.kamar.findUnique({
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

const createKamar = async (req, res) => {
  const { no_kamar, jenis_kamar, kapasitas, jenis_bed, luas_kamar, fasilitas, status_ketersediaan, id_tarif } = req.body;
  const { error, value } = kamarValidator.validate(req.body);

  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  try {
    const kamar = await prisma.kamar.create({
      data: {
        no_kamar,
        jenis_kamar,
        kapasitas: Number(kapasitas),
        jenis_bed,
        luas_kamar,
        fasilitas,
        status_ketersediaan: Boolean(status_ketersediaan),
        id_tarif: Number(id_tarif),
      },
    });

    const response = new Response.Success(false, "Data inserted successfully", kamar);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const updateKamar = async (req, res) => {
  const { no_kamar, jenis_kamar, kapasitas, jenis_bed, luas_kamar, fasilitas, status_ketersediaan, id_tarif } = req.body;
  const { error, value } = kamarValidator.validate(req.body);

  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  try {
    const kamar = await prisma.kamar.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        no_kamar,
        jenis_kamar,
        kapasitas: Number(kapasitas),
        jenis_bed,
        luas_kamar,
        fasilitas,
        status_ketersediaan: Boolean(status_ketersediaan),
        id_tarif: Number(id_tarif),
      },
    });

    const response = new Response.Success(false, "Data edited successfully", kamar);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const deleteKamar = async (req, res) => {
  try {
    const kamar = await prisma.kamar.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    const response = new Response.Success(false, "Data deleted successfully", kamar);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

module.exports = {
  createKamar,
  getKamar,
  getKamarById,
  deleteKamar,
  updateKamar,
};
