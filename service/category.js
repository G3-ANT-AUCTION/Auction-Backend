const categoriesModel = require('../model/category')
const create = async (body) =>{
  let check = await categoriesModel.findByName(body)
  if(check.length > 0){
    throw new Error("category name Duplicate");
  }
  let result  = await categoriesModel.create(body)
  return {
    message : "create category successfully",
    data : await categoriesModel.findById(result.insertId)
  }
}

const getAll = async(page , per_page ,sort_by , search) =>{
  let offset = (page - 1 ) * per_page
  let result = await categoriesModel.getAll(per_page, offset ,sort_by,search)
  let total = await categoriesModel.countCategories(search)
  return {
    message : 'Get all categories successfully',
    data : result,
    pagination : {
      total , 
      page , 
      per_page , 
      totalPage : Math.ceil(total/per_page)
    }
  }
}

const update = async (name ,id) =>{
  let check = await categoriesModel.findById(id)
  if(check.length==0){
    throw new Error("Category not found");
  }
  let result = await categoriesModel.update(name ,id)
  if (result.affectedRows === 0) {
    throw new Error("Update failed");
  }
  return {
    message : "update category success",
    data : await categoriesModel.findById(id)
  }
}

const remove = async (id) =>{
  let check = await categoriesModel.findById(id)
  if(check.length==0){
    throw new Error("Category not found");
  }
  let result = await categoriesModel.remove(id)
  return {
    message : "Delete category successfully"
  }
}

module.exports = {
  create,
  getAll,
  update,
  remove
}