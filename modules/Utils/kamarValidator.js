const Joi = require('joi');

const kamarSchema = Joi.object({
  no_kamar: Joi.string().required(),
  jenis_kamar: Joi.string().required(),
  kapasitas: Joi.number().required(),
  jenis_bed: Joi.string().required(),
  luas_kamar: Joi.string().required(),
  fasilitas: Joi.string().required(),
  status_ketersediaan: Joi.boolean().required(),
  id_tarif: Joi.number().required(),
});

module.exports = kamarSchema;