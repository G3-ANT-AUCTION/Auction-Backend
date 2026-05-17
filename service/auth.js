const user = require('../model/users')
const user_profiles = require('../model/user_profiles')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtConfig = require('../config/jwt')
const crypto = require('crypto')
const sendMailVerfication = require('./mailerService')
const sendForgotPassowrdEmail = require('./forgotPassword')


const register = async (body) => {
    let checkemail = await user.getByEmail(body.email)

    if (checkemail.length > 0) {
        throw new Error('Email already exist')
    }

    const hashPassword = await bcrypt.hash(body.password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificatoinExpires = new Date(Date.now() + 60 * 60 * 1000);

    const result = await user.create({
        fullName: body.name,
        email: body.email,
        password: hashPassword,
        verificationToken,
        verificatoinExpires
    })

    await sendMailVerfication.sendVerificationEmail(body.email, verificationToken)

    await user_profiles.createUserProfile({
        userId: result,
        fullName: body.name,
        gender: body.gender,
        address: body.address,
    })

    const row = await user.findById(result)
    return row;
}

const login = async (body) => {

    let userInfo = await user.getByEmail(body.email)

    if (userInfo.length == 0) {
        throw new Error('Email or Password id invalid')
    }

    let isMatch = await bcrypt.compare(body.password, userInfo[0].password)
    // console.log(isMatch);
    if (!isMatch) {
        throw new Error('Email or Password id invalid ');
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
            expiresIn: jwtConfig.expireIn
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
    const verificatoinExpires = new Date(Date.now() + 60 * 60 * 1000);

    await user.resendVerificationEmail({
        verificationToken,
        verificatoinExpires,
        id: userInfo[0].id
    })

    await sendMailVerfication.sendVerificationEmail(email, verificationToken)


    return { message: 'Verification email resent successfully' }
}

const forgotPassword = async (email) => {
    const row = await user.getByEmail(email);
    console.log(row);
    if (row.length == 0) {
        throw new Error("Invalid Email");
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 10 * 60 * 1000);

    await user.sendForgotPasswordEmail({
        resetToken: resetToken,
        resetExpires: resetExpires,
        id: row[0].id
    })

    await sendForgotPassowrdEmail(email, resetToken)
    const result = await user.findById(row[0].id);
    return {
        resetToken: result.reset_token,
        resetExpires: result.reset_expires
    };
}

const resetPassword = async (body) => {
    const row = await user.findByResetToken(body.token);
    if (row.length == 0) {
        throw new Error("Invalid Token");
    }
    if(!row[0].reset_expires || row[0].reset_expires < new Date()){
        throw new Error("Token is expired");
    }
    const hashPassword = await bcrypt.hash(body.password,10);
    await user.resetPassword({
        password: hashPassword,
        id: row[0].id
    })

}
module.exports = {
    register,
    login,
    getById,
    logout,
    verifyEmail,
    resendVerificationEmail,
    forgotPassword,
    resetPassword
}