const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt')
const user = require('../model/users')

const login = async (req, res, next) => {

    try {
        let authheader = req.headers.authorization
        if (!authheader) {
            res.json({
                result: false,
                massage: "you need login"
            })
        }

        let parts = authheader.split(' ');
        if (parts.length !== 2 || parts[0] != 'Bearer') {
            res.json({
                result: false,
                massage: "Invalid token"
            })
        }

        let token = parts[1];
        let decode = jwt.verify(token, jwtConfig.secret);

        let userInfo = await user.findByToken(token)

        if (userInfo.length == 0) {
            throw new error('Invaild Token or expired');

        }

        req.user = decode
        next();
    } catch (error) {
        res.json({
            result: false,
            massage: "Invalid token or expired"
        })
    }

}

module.exports = {
    login
}