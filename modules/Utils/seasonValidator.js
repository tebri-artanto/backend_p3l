const Joi = require('joi');

const seasonSchema = Joi.object({
  nama_season: Joi.string().required(),
  jenis_season: Joi.string().required(),
  tanggal_mulai: Joi.date().required(),
  tanggal_selesai: Joi.date().required(),
});

module.exports = seasonSchema;