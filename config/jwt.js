const jwtConfig = {
    secret : process.env.JWT_SECRET,
    expireIn : '1d'
}
    
module.exports = jwtConfig;