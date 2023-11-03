const httpStatus = require("http-status");
const Response = require("../Model/Response");
const fasilitasTambahanValidator = require("../Utils/fasilitasTambahanValidator");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getFasilitasTambahan = async (req, res) => {
  try {
    const fasilitasTambahan = await prisma.fasilitasTambahan.findMany();
    const response = new Response.Success(false, "Results found", fasilitasTambahan);
      res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const getFasilitasTambahanById = async (req, res) => {
  try {
    const response = await prisma.fasilitasTambahan.findUnique({
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

const createFasilitasTambahan = async (req, res) => {
  const { nama_fasilitas, harga, stock } = req.body;

  const { error, value } = fasilitasTambahanValidator.validate(req.body);

  const existingUser = await prisma.fasilitasTambahan.findFirst({
    where: {
        OR: [{ nama_fasilitas: nama_fasilitas }]
    }
})

if (existingUser) {
    const response = new Response.Error(true, 'Username already exists')
    return res.status(httpStatus.BAD_REQUEST).json(response)
}

  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  try {
    const fasilitasTambahan = await prisma.fasilitasTambahan.create({
      data: {
        nama_fasilitas,
        harga: Number(harga), 
        stock: Number(stock), 
      },
    });

    const response = new Response.Success(false, "Data inserted successfully", fasilitasTambahan);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const updateFasilitasTambahan = async (req, res) => {
  const { nama_fasilitas, harga, stock } = req.body;
  const { error, value } = fasilitasTambahanValidator.validate(req.body);

  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  try {
    const fasilitasTambahan = await prisma.fasilitasTambahan.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        nama_fasilitas,
        harga: Number(harga), 
        stock: Number(stock), 
      },
    });

    const response = new Response.Success(false, "Data edited successfully", fasilitasTambahan);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const deleteFasilitasTambahan = async (req, res) => {
  try {
    const fasilitasTambahan = await prisma.fasilitasTambahan.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    const response = new Response.Success(false, "Data deleted successfully", fasilitasTambahan);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

module.exports = {
  createFasilitasTambahan,
  getFasilitasTambahan,
  getFasilitasTambahanById,
  deleteFasilitasTambahan,
  updateFasilitasTambahan,
};
