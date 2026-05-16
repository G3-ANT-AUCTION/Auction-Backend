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

module.exports = {
    registerUserSchema,
    loginUserSchema,
    resendVerificationEmailSchema
}