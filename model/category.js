const pool = require('../config/db')

const create = async (body) =>{
  let [result] = await pool.query(
    "insert into categories (name) values (?)" ,[body.name]
  )
  return result
}

const findById = async (id) =>{
  let [result]= await pool.query(
    "select id , name from categories where id = ?" ,[id]
  )
  return result
}
const findByName = async (body) =>{
  let [result]= await pool.query(
    "select id , name from categories where name = ?" ,[body.name]
  )
  return result
}
const getAll = async (per_page , offset ,sort_by ,search) =>{
  const keyword = `%${search}%`;
  let [result]= await pool.query(
    `
    select id , name from categories
    where name LIKE ?
    ORDER BY id ${sort_by}
    LIMIT ? OFFSET ?
    `,[keyword,per_page,offset]
  )
  return result
}
const countCategories = async (search) =>{
  const keyword = `%${search}%`;
  const [result] = await pool.query(
    `SELECT COUNT(*) as total FROM categories 
     WHERE name LIKE ?
    `,[keyword]
  );
  return result[0].total
}
const update = async (name ,id) =>{
  let [result] = await pool.query(
    `update categories set name = ? where id = ?
    `,[name , id]
  )
  return result
}

const remove = async (id) =>{
  let [result] = await pool.query(
    `
    DELETE FROM categories 
    WHERE id = ? 
    `,[id]
  )
  return result
}
module.exports = {
  create,
  findById,
  findByName,
  getAll,
  countCategories,
  update,
  remove
}