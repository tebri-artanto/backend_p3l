const Joi = require('joi');

const customerSchema = Joi.object({
  nama: Joi.string().required(),
  no_identitas: Joi.string().required(),
  no_telp: Joi.string().required(),
  email: Joi.string().required(),
  alamat: Joi.string().required(),
});

module.exports = customerSchema;