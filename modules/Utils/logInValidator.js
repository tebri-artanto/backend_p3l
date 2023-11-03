const Joi = require("joi");

const logInValidator = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = logInValidator;