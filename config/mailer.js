const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    service: 'gmail',
    auth: {
        user: 'chanponloeur02@gmail.com',
        pass: 'llhxqcngyakgqcjn'
    }
})

module.exports = transporter