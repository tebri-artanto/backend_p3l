const httpStatus = require("http-status");
const Response = require("../Model/Response");
const seasonValidator = require("../Utils/seasonValidator");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getSeason = async (req, res) => {
  try {
    const season = await prisma.season.findMany();
    const response = new Response.Success(false, "Results found", season);
      res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const getSeasonById = async (req, res) => {
  try {
    const response = await prisma.season.findUnique({
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
const toISOIgnoreTimezone = (inputDate) => {
  return inputDate.getFullYear() + "-" +  
    ("0" + (inputDate.getMonth()+1)).slice(-2) + "-" +
    ("0" + inputDate.getDate()).slice(-2) + "T00:00:00.000Z";
}
const createSeason = async (req, res) => {
  const { nama_season, tanggal_mulai, tanggal_selesai } = req.body;

  const { error, value } = seasonValidator.validate(req.body);

//   const existingUser = await prisma.akun.findFirst({
//     where: {
//         OR: [{ username: username }]
//     }
// })

// if (existingUser) {
//     const response = new Response.Error(true, 'Username already exists')
//     return res.status(httpStatus.BAD_REQUEST).json(response)
// }

  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  try {
    const season = await prisma.season.create({
      data: {
        nama_season,
        tanggal_mulai: new Date(tanggal_mulai), // Convert to a JavaScript Date object
        tanggal_selesai: new Date(tanggal_selesai), // Convert to a JavaScript Date object
      },
    });

    const response = new Response.Success(false, "Data inserted successfully", season);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const updateSeason = async (req, res) => {
  const { nama_season, tanggal_mulai, tanggal_selesai } = req.body;
  const { error, value } = seasonValidator.validate(req.body);

  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  try {
    
    const season = await prisma.season.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        nama_season,
        tanggal_mulai: new Date(tanggal_mulai),
        tanggal_selesai: new Date(tanggal_selesai),
      },
    });

    const response = new Response.Success(false, "Data edited successfully", season);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const deleteSeason = async (req, res) => {
  try {
    const season = await prisma.season.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    const response = new Response.Success(false, "Data deleted successfully", season);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

module.exports = {
  createSeason,
  getSeason,
  getSeasonById,
  deleteSeason,
  updateSeason,
};
