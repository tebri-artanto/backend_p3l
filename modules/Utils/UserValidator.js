const Joi = require("joi");

const userValidator = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = userValidator;