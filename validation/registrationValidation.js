const Joi = require("joi");

const regValidation = (form) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    repeat_password: Joi.ref("password"),
  }).with("password", "repeat_password");

  return schema.validate(form);
};

module.exports = regValidation;
