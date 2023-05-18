const Joi = require("joi");

const loginValidation = (form) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(form);
};

module.exports = loginValidation;
