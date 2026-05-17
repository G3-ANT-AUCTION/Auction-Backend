const auth = require('../service/auth')


const register = async (req, res) => {

    try {
        
        let result = await auth.register(req.validatedData);

        res.json({
            result: true,
            msg: 'Register User Successfully',
            data: result
        })

    } catch (error) {
        console.log(error);

        res.json({
            result: false,
            msg: error.message,
        })
    }
}

const login = async (req, res) => {
    try {
        let result = await auth.login(req.validatedData)

        res.json({
            result: true,
            msg: 'Login User Successfully',
            data: result
        })

    } catch (error) {
        console.log(error);

        res.json({
            result: false,
            msg: error.message,
        })
    }

}

const getMe = async (req, res) => {
    try {
        const row = await auth.getById(req.user.id)

        res.json({
            result: true,
            msg: 'Get User Successfully',
            data: row[0]
        })

    } catch (error) {
        console.log(error);

        res.json({
            result: false,
            msg: error.message,
        })
    }

}


const logout = async (req, res) => {
    try {
        const row = await auth.logout(req.user.id)

        res.json({
            result: true,
            msg: 'Logout Successfully',
            data: []
        })

    } catch (error) {
        res.json({
            result: false,
            msg: "invalid Token or expired"
        })
    }
}

const verifyEmail = async (req, res) => {
    try {
        let row = await auth.verifyEmail(req.query.token)
        res.json({
            result: true,
            msg: row.message,
            data: []
        })

    } catch (error) {
        console.log(error);
        res.json({
            result: false,
            msg: error.message
        })
    }
}

const resendVerificationEmail = async (req, res) => {
    try {
        let row = await auth.resendVerificationEmail(req.validatedData.email)
        res.json({
            result: true,
            msg: row.message,
            data: []
        })
    } catch (error) {
        console.log(error);
        res.json({
            result: false,
            msg: error.message
        })
    }
}

const forgotPassword = async (req, res) => {
    try {
        let row = await auth.forgotPassword(req.validatedData.email)
        res.json({
            result: true,
            msg: 'Forgot password email sent successfully',
            data: row
        })
    } catch (error) {
        console.log(error);
        res.json({
            result: false,
            msg: error.message
        })
    }
}

const resetPassword = async (req, res) => {
    try {
        let row = await auth.resetPassword(req.validatedData)
        res.json({
            result: true,
            msg: 'Password reset successfully',
            data: row
        })
    } catch (error) {
        console.log(error);
        res.json({
            result: false,
            msg: error.message
        })
    }
}

module.exports = {
    register,
    login,
    getMe,
    logout,
    verifyEmail,
    resendVerificationEmail,
    forgotPassword,
    resetPassword
}