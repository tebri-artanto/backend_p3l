const Joi = require('joi');

const tarifSchema = Joi.object({
  jenis_tarif: Joi.string().required(),
  besaran_tarif: Joi.number().required(),
  id_season: Joi.number().required(),
});

module.exports = tarifSchema;