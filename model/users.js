const pool = require('../config/db')

const getByEmail = async (email) => {
    let [row] = await pool.query('select email,password,id,token,verification_token,is_verified from users where email = ? ', [email])

    return row
}

const create = async (body) => {
    let [result] = await pool.query('insert into users (email, password,role_id,verification_token,verification_expires) values (?,?, ?, ?, ?)', [body.email, body.password, 2, body.verificationToken, body.verificatoinExpires]);

    return result.insertId;
}

const findById = async (id) => {
    let [row] = await pool.query('SELECT u.id,up.full_name,up.gender,u.email,up.phone_number,r.name as role,up.address,up.dob,up.profile_image,u.verification_token,is_active,u.is_verified,u.token FROM users u INNER JOIN user_profiles up on u.id = up.user_id left join roles r on u.role_id = r.id WHERE u.id = ?', [id]);
    return row[0];
}

const findByToken = async (token) => {
    let [row] = await pool.query('select * from users where token = ?', [token]);

    return row;
}

const addToken = async (token, id) => {
    await pool.query('update users set token = ? where id = ?', [token, id])
}

const deleteToken = async (id) => {
    await pool.query('update users set token = null where id = ?', [id])
}

const findVerificationToken = async (token) => {
    let [row] = await pool.query('select * from users where verification_token = ?', [token])

    return row
}

const verifyEmail = async (id) => {
    let [row] = await pool.query('update users set is_verified = 1')

    return row
}

const resendVerificationEmail = async (body) => {
    let [row] = await pool.query('update users set verification_token = ?, verification_expires = ? where id = ?', [body.verificationToken, body.verificatoinExpires, body.id])

    return row
}

module.exports = {

    getByEmail,
    findById,
    create,
    addToken,
    deleteToken,
    deleteToken,
    findByToken,
    findVerificationToken,
    verifyEmail,
    resendVerificationEmail

}