const Joi = require('joi');

const fasilitasTambahanSchema = Joi.object({
  nama_fasilitas: Joi.string().required(),
  harga: Joi.number().required(),
  stock: Joi.number().required(),
});

module.exports = fasilitasTambahanSchema;