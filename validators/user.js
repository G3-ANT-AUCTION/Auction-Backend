const Joi = require('joi');

const registerUserSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
        .required()
        .messages({
            'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character.',
            'string.min': 'Password must be at least 8 characters long.',
        }),
    gender : Joi.string().valid('male', 'female', 'other').required(),
    address : Joi.string().required()
})

const loginUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.required()
})

const resendVerificationEmailSchema = Joi.object({
    email: Joi.string().email().required()
})
const forgotPassword = Joi.object({
    email: Joi.string().email().required()
})
const resetPassword = Joi.object({
    password: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
        .required()
        .messages({
            'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character.',
            'string.min': 'Password must be at least 8 characters long.',
        }),
    token: Joi.string().required(),
})

const updateProfileSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 100 characters'
    }),

  gender: Joi.string()
    .valid('male', 'female', 'other')
    .required()
    .messages({
      'any.only': 'Gender must be male, female, or other',
      'string.empty': 'Gender is required'
    }),

  phone_number: Joi.string()
    .pattern(/^[0-9]{8,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be 8 to 15 digits',
      'string.empty': 'Phone number is required'
    }),

  address: Joi.string()
    .min(5)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Address is required',
      'string.min': 'Address must be at least 5 characters',
      'string.max': 'Address cannot exceed 255 characters'
    }),

  dob: Joi.date()
    .less('now')
    .required()
    .messages({
      'date.base': 'Date of birth must be a valid date',
      'date.less': 'Date of birth must be in the past',
      'any.required': 'Date of birth is required'
    })
});

module.exports = {
    registerUserSchema,
    loginUserSchema,
    resendVerificationEmailSchema,
    forgotPassword,
    resetPassword,
    updateProfileSchema
}