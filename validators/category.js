const Joi = require('joi')

const fieldSchema = Joi.object({
  name : Joi.string()
  .min(2)
  .max(100)
  .trim()
  .required()
})

module.exports = fieldSchema