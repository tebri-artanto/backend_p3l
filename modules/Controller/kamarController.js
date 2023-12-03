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

const getKamarByIdSeason = async (req, res) => {
  try {
    const idSeason = Number(req.params.id_season); // Assuming you pass the idSeason as a query parameter

    // Get the tarif data based on the idSeason provided
    const tarif = await prisma.tarif.findMany({
      where: {
        id_season: idSeason,
      },
    });

    // Get the kamar data based on the id_kamar in the tarif data retrieved in step 1
    const kamar = await prisma.kamar.findMany({
      where: {
        id: {
          in: tarif.map((t) => t.id_kamar),
        },
      },
    });

    const response = new Response.Success(false, "Results found", kamar);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const getMutipleKamarById = async (req, res) => {
  try {
    const idKamarList = req.body.idKamar; // Assuming you pass the IDs as an array in the request body

    if (!idKamarList || !Array.isArray(idKamarList)) {
      return res
        .status(400)
        .json({
          error: "Invalid or missing idKamar array in the request body",
        });
    }

    // Use Prisma to retrieve Kamar records based on the provided tarif IDs
    const kamarData = await prisma.kamar.findMany({
      where: {
        id: {
          in: idKamarList, // Use the "in" operator to match multiple IDs
        },
      },
    });
    res.status(200).json({
      status: "success",
      message: "Data fetched successfully",
      data: kamarData,
    });
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const createKamar = async (req, res) => {
  const {
    no_kamar,
    jenis_kamar,
    kapasitas,
    jenis_bed,
    luas_kamar,
    fasilitas,
    status_ketersediaan,
  } = req.body;
  const { error, value } = kamarValidator.validate(req.body);

  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  const existingKamar = await prisma.kamar.findFirst({
    where: {
      OR: [{ no_kamar: no_kamar }],
    },
  });

  if (existingKamar) {
    const response = new Response.Error(true, "Kamar already exists");
    return res.status(httpStatus.BAD_REQUEST).json(response);
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
        status_ketersediaan,
      },
    });

    const response = new Response.Success(
      false,
      "Data inserted successfully",
      kamar
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const searchKamarByDate = async (req, res) => {
  const { season, date } = req.query;
  try {
    const kamar = await prisma.kamar.findMany({
      where: {
        AND: [
          { id_tarif: season }, // Assuming 'season' is a scalar value like a number or string
          {
            season: {
              some: {
                tanggal_mulai: { lte: new Date(date) },
                tanggal_selesai: { gte: new Date(date) },
              },
            },
          },
        ],
      },
      include: {
        season: {
          where: {
            AND: [
              { tanggal_mulai: { lte: new Date(date) } },
              { tanggal_selesai: { gte: new Date(date) } },
            ],
          },
        },
      },
    });

    const response = new Response.Success(
      false,
      "Data retrieved successfully",
      kamar
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const updateKamar = async (req, res) => {
  const {
    no_kamar,
    jenis_kamar,
    kapasitas,
    jenis_bed,
    luas_kamar,
    fasilitas,
    status_ketersediaan,
  } = req.body;
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
        status_ketersediaan,
      },
    });

    const response = new Response.Success(
      false,
      "Data edited successfully",
      kamar
    );
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
    const response = new Response.Success(
      false,
      "Data deleted successfully",
      kamar
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const getKamarByIdTarif = async (req, res) => {
  try {
    const kamar = await prisma.kamar.findMany({
      where: {
        id_tarif: Number(req.params.id_tarif),
      },
    });
    const response = new Response.Success(
      false,
      "Data retrieved successfully",
      kamar
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

// const handleSearch = async (event) => {
//   event.preventDefault();
//   try {
//     const seasons = await prisma.season.findMany({
//       where: {
//         tanggal_mulai: value.startDate,
//         tanggal_selesai: value.endDate,
//       },
//     });
//     if (seasons.length > 0) {
//       const seasonId = seasons[0].id;

//       const tarifs = await prisma.tarif.findMany({
//         where: {
//           seasonId: seasonId,
//         },
//         include: {
//           kamars: true,
//         },
//       });
//       setTarifs(tarifs);
//       console.log(tarifs);

//       if (tarifs.length > 0) {
//         const kamars = tarifs.flatMap((tarif) => tarif.kamars);
//         setKamars(kamars);
//         console.log(kamars);
//       } else {
//         console.log("No tariffs found for this season");
//         setKamars([]);
//         setTarifs([]);
//       }
//     } else {
//       console.log("No seasons found in this date range");
//       setKamars([]);
//       setTarifs([]);
//     }
//   } catch (error) {
//     console.error("There was an error fetching the seasons:", error);
//   }
// };

const getKamarBySeason = async (req, res) => {
  try {
    const { tanggal_mulai, tanggal_selesai } = req.query;

    const seasons = await prisma.season.findFirst({
      where: {
        tanggal_mulai: {
          lte: new Date(tanggal_mulai),
        },
        tanggal_selesai: {
          gte: new Date(tanggal_selesai),
        },
      },
    });
    const seasonId = seasons.id;
    const buildReservasiCondition = (tanggal_mulai, tanggal_selesai) => {
      return {
        reservasi: {
          tanggal_checkin: {
            lte: new Date(tanggal_mulai),
          },
          tanggal_checkout: {
            gte: new Date(tanggal_selesai),
          },
        },
      };
    };

    const buildTarifCondition = (reservasiCondition) => {
      return {
        Tarif: {
          every: {
            id_season: seasonId,
            NOT: {
              TransaksiKamar: {
                some: reservasiCondition,
              },
            },
          },
        },
      };
    };

    const buildIncludeCondition = () => {
      return {
        Tarif: {
          include: {
            season: true,
          },
        },
      };
    };

    // // Usage
    const reservasiCondition = buildReservasiCondition(
      tanggal_mulai,
      tanggal_selesai
    );
    const tarifCondition = buildTarifCondition(reservasiCondition);
    const includeCondition = buildIncludeCondition();

    const result = await prisma.kamar.findMany({
      where: tarifCondition,
      include: includeCondition,
    });

    // const result = await prisma.tarif.findMany({
    //   where: {
    //     id_season: seasonId,
    //   },
    //   include: {
    //     kamar: true,
    //   },
    // });
    const response = new Response.Success(
      false,
      "Data fetched successfully",
      result
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createKamar,
  getKamar,
  getKamarById,
  deleteKamar,
  updateKamar,
  searchKamarByDate,
  getKamarByIdTarif,
  getMutipleKamarById,
  getKamarByIdSeason,
  getKamarBySeason,
};
