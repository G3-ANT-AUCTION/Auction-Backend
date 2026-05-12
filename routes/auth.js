const express = require('express')
const route = express.Router()
const auth = require('../controller/auth')
const authMiddleware = require('../middlewares/auth')
const validate = require('../middlewares/validate')
const { registerUserSchema, loginUserSchema, resendVerificationEmailSchema } = require('../validators/user')


route.post('/register', validate(registerUserSchema), auth.register)
route.post('/login', validate(loginUserSchema), auth.login)
route.get('/me', authMiddleware.login, auth.getMe)
route.delete('/logout', authMiddleware.login, auth.logout)
route.get('/verify-email', auth.verifyEmail)
route.post('/resend-verificationEmail', validate(resendVerificationEmailSchema), auth.resendVerificationEmail)

module.exports = route