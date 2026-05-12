const user = require('../model/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtConfig = require('../config/jwt')
const crypto = require('crypto')
const sendMailVerfication = require('./mailerService')

const register = async (body) => {

    if (!body.name || !body.email || !body.password) {
        throw new Error('Name, Email, Password is required ')
    }

    let checkemail = await user.getByEmail(body.email)

    if (checkemail.length > 0) {
        throw new Error('Email already exist')
    }

    const hashPassword = await bcrypt.hash(body.password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificatoinExpires = new Date(Date.now() + 3 * 60 * 1000);

    const result = await user.create({
        name: body.name,
        email: body.email,
        password: hashPassword,
        verificationToken,
        verificatoinExpires
    })

    await sendMailVerfication.sendVerificationEmail(body.email, verificationToken)

    const row = await user.findById(result)

    return row;
}

const login = async (body) => {
    if (!body.email || !body.password) {
        throw new Error(' Email, Password is required ')
    }

    let userInfo = await user.getByEmail(body.email)

    if (userInfo.length == 0) {
        throw new Error('Email or Password id invalid')
    }

    let isMatch = await bcrypt.compare(body.password, userInfo[0].password)
    // console.log(isMatch);
    if (!isMatch) {
        console.log('Email or Password id invalid ');
    }

    if (!userInfo[0].is_verified) {
        throw new Error('Please verify your email before login')
    }

    let token = jwt.sign(
        {
            id: userInfo[0].id,
            email: userInfo[0].email
        },
        jwtConfig.secret,
        {
            expiresIn: jwtConfig.exprieIn
        }
    )

    await user.addToken(token, userInfo[0].id)
    const row = await user.findById(userInfo[0].id)

    return row

}

const logout = async (id) => {
    const row = await user.deleteToken(id)

    return row
}

const getById = async (id) => {
    const row = await user.findById(id)

    return row
}

const verifyEmail = async (token) => {
    console.log(token);

    if (!token) {
        throw new Error("Token is reqired");

    }

    let userInfo = await user.findVerificationToken(token)

    if (userInfo.length == 0) {
        throw new Error("Invalid Token");
    }

    if (userInfo[0].is_verified) {
        throw new Error("Email is already Verify");
    }

    if (!userInfo[0].verification_expires || userInfo[0].verification_expires < new Date()) {
        throw new Error("Token is expires");
    }

    await user.verifyEmail(userInfo[0].id);

    return { message: 'Email Verify Successfully' }

}

const resendVerificationEmail = async (email) => {
    if (!email) {
        throw new Error("Email is reqired");
    }

    const userInfo = await user.getByEmail(email)

    if (userInfo.length == 0) {
        throw new Error("Invalid Email")
    }

    if (userInfo[0].is_verified) {
        throw new Error("Email is already Verify")
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificatoinExpires = new Date(Date.now() + 3 * 60 * 1000);

    await user.resendVerificationEmail({
        verificationToken,
        verificatoinExpires,
        id : userInfo[0].id
    })

    await sendMailVerfication.sendVerificationEmail(email, verificationToken)


    return { message: 'Verification email resent successfully' }
}

module.exports = {
    register,
    login,
    getById,
    logout,
    verifyEmail,
    resendVerificationEmail
}