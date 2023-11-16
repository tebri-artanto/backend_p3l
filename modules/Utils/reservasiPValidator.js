
const Joi = require('joi');

const reservasiPSchema = Joi.object({
    jumlah_anak: Joi.number().integer().required(), 
    jumlah_dewasa: Joi.number().integer().required(),
    tanggal_checkin: Joi.date(  ).required(),
    tanggal_checkout: Joi.date().required(),
    create_by: Joi.string().required(),
    id_customer: Joi.number().integer().required(),
    total_bayarReservasi: Joi.number().integer().required(),
});

module.exports = reservasiPSchema;
