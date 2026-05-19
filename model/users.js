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
    let [row] = await pool.query('SELECT u.id,up.full_name,up.gender,u.email,up.phone_number,r.name as role,up.address,up.dob,up.profile_image,u.verification_token,is_active,u.is_verified,u.token,u.reset_token,u.reset_expires FROM users u INNER JOIN user_profiles up on u.id = up.user_id left join roles r on u.role_id = r.id WHERE u.id = ?', [id]);
    return row[0];
}

const findByToken = async (token) => {
    let [row] = await pool.query('select * from users where token = ?', [token]);

    return row;
}

const findByResetToken = async (token) => {
    let [row] = await pool.query('select id,email,reset_token,reset_expires from users where reset_token = ?', [token]);
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

const sendForgotPasswordEmail = async (body) => {
    let sql = 'UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?';
    await pool.query(sql, [body.resetToken, body.resetExpires, body.id]);
}

const resetPassword = async (body) => {
    let sql = 'UPDATE users SET password = ?, reset_token = null, reset_expires = null WHERE id = ?';
    await pool.query(sql, [body.password, body.id]);
}

const getAll = async (per_page, offset, sort_by, search) => {
    const keyword = `%${search}%`;
    const [result] = await pool.query(`
    SELECT 
      u.id,
      u.email,
      r.name AS role_name,
      u.is_active,
      u.is_verified,

      up.full_name,
      up.gender,
      up.phone_number,
      up.address,
      up.dob,
      up.profile_image
    FROM users u
    INNER JOIN user_profiles up 
      ON u.id = up.user_id
    INNER JOIN roles r
      ON r.id = u.role_id
    WHERE up.full_name LIKE ? 
       OR u.email LIKE ?
    ORDER BY u.id ${sort_by}
    LIMIT ? OFFSET ?
  `, [keyword, keyword, per_page, offset]);

    return result;
}

const countUsers = async (search) => {
    const keyword = `%${search}%`;
    const [result] = await pool.query(`
     SELECT COUNT(*) AS total_users
    FROM users
    INNER JOIN user_profiles 
      ON users.id = user_profiles.user_id
    WHERE 
      users.email LIKE ?
      OR user_profiles.full_name LIKE ?
      OR user_profiles.phone_number LIKE ?
  `,[keyword , keyword , keyword]);

    return result[0].total_users;
};

const updateInfo = async (body , id) =>{
    let [result] = await pool.query(
        `UPDATE user_profiles SET 
        full_name = ? ,
        gender = ? ,
        phone_number = ?,
        address = ? ,
        dob = ?
        WHERE user_id = ?
        `,
        [body.name ,body.gender,body.phone_number , body.address , body.dob ,id]
    )
    return result
}

const getUser = async(id) =>{
    let [result] = await pool.query(
        `SELECT 
        up.user_id,
        up.full_name,
        up.gender,
        up.phone_number,
        up.address,
        up.dob,
        up.profile_image
        FROM user_profiles up
        WHERE up.user_id = ? 
        `,[id]
    )
    return result
}

const uploadImage = async (image , id) =>{
    let [result] = await pool.query(
        `UPDATE user_profiles SET profile_image = ? WHERE user_id = ?
        `,[image , id]
    )
    return result
}

const deleteImage = async (id) =>{
    let [result] = await pool.query(
        `UPDATE user_profiles SET profile_image = 'images/defalut-user-img.jpg' WHERE user_id = ?
        `,[id]
    )
    return result
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
    resendVerificationEmail,
    sendForgotPasswordEmail,
    findByResetToken,
    resetPassword,
    getAll,
    countUsers,
    updateInfo,
    getUser,
    uploadImage,
    deleteImage
}