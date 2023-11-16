const Joi = require('joi');

const tarifSchema = Joi.object({
  besaran_tarif: Joi.number().required(),
  id_season: Joi.number().required(),
  id_kamar: Joi.number().required(),
});

module.exports = tarifSchema;