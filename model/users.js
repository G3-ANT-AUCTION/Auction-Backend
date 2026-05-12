const pool = require('../config/db')

const getByEmail = async (email) => {
    let [row] = await pool.query('select email,password,id, phone, address,token,verification_token,is_verified from users where email = ? ', [email])

    return row
}

const create = async (body) => {
    let data = [body.name, body.email, body.password, body.verificationToken, body.verificatoinExpires];
    let [result] = await pool.query('insert into users (name, email, password,verification_token,verification_expires) values (?, ?, ?, ?, ?)', data);

    return result.insertId;
}

const findById = async (id) => {
    let [row] = await pool.query('select * from users where id = ?', [id]);

    return row;
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