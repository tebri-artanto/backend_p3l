const httpStatus = require("http-status");
const Response = require("../Model/Response");
const tarifValidator = require("../Utils/tarifValidator");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getTarif = async (req, res) => {
  try {
    const tarif = await prisma.tarif.findMany();
    const response = new Response.Success(false, "Results found", tarif);
      res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const getTarifById = async (req, res) => {
  try {
    const response = await prisma.tarif.findUnique({
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

const createTarif = async (req, res) => {
  const { jenis_tarif, besaran_tarif, id_season } = req.body;
  const { error, value } = tarifValidator.validate(req.body);

  const existingUser = await prisma.tarif.findFirst({
    where: {
        OR: [{ besaran_tarif: Number(besaran_tarif) }]
    }
})

if (existingUser) {
    const response = new Response.Error(true, 'Tarif already exists')
    return res.status(httpStatus.BAD_REQUEST).json(response)
}

  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  try {
    const tarif = await prisma.tarif.create({
      data: {
        jenis_tarif,
        besaran_tarif: Number(besaran_tarif),
        id_season: Number(id_season),
      },
    });

    const response = new Response.Success(false, "Data inserted successfully", tarif);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const updateTarif = async (req, res) => {
  const { jenis_tarif, besaran_tarif, id_season } = req.body;
  const { error, value } = tarifValidator.validate(req.body);

  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  try {
    const tarif = await prisma.tarif.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        jenis_tarif,
        besaran_tarif: Number(besaran_tarif),
        id_season: Number(id_season),
      },
    });

    const response = new Response.Success(false, "Data edited successfully", tarif);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const deleteTarif = async (req, res) => {
  try {
    const tarif = await prisma.tarif.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    const response = new Response.Success(false, "Data deleted successfully", tarif);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

module.exports = {
  createTarif,
  getTarif,
  getTarifById,
  deleteTarif,
  updateTarif,
};
