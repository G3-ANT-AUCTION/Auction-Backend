const pool = require('../config/db');

const createUserProfile = async (body) => {
    const phoneNumber = await getByPhoneNumber(body.phoneNumber);
    if (phoneNumber.length > 0) {
        throw new Error('Phone number already exits');
    }
    let sql = 'INSERT INTO user_profiles (user_id,full_name,gender,address) VALUES (?,?,?,?)';
    let [result] = await pool.query(sql, [body.userId, body.fullName, body.gender, body.address]);
    return result.insertId;

}
const getByPhoneNumber = async (phoneNumber) => {
    let [row] = await pool.query('SELECT phone_number FROM user_profiles WHERE phone_number = ? ',[phoneNumber]);
    return row;
    
}

module.exports = {
    createUserProfile,
    getByPhoneNumber
}