const categoriesService = require('../service/category')

const create = async(req ,res) =>{
  try {
    let result = await categoriesService.create(req.body)
    return res.json({
      result : true,
      msg : result.message,
      data : result.data[0]
    })
  } catch (error) {
    console.log(error)
    res.json({
      result : false,
      data : error.message
    })
  }
}

const getAll = async (req,res) =>{
  try {
    let page = parseInt(req.query.page) || 1
    let per_page = parseInt(req.query.per_page) || 10
    let sort_by = req.query.sort_by || 'DESC'
    sort_by = sort_by.toUpperCase();
    if (sort_by !== "ASC" && sort_by !== "DESC") {
      sort_by = "DESC";
    }
    const search = req.query.search || "";
    let result = await categoriesService.getAll(page,per_page,sort_by,search)
    return res.json({
      result : true,
      msg : result.message,
      data : result.data,
      pagination : result.pagination
    })
  } catch (error) {
    console.log(error)
    res.json({
      result : false,
      data : error.message
    })
  }
}

const update = async (req,res) =>{
  try {
    let result = await categoriesService.update(req.body.name , req.params.id)
    return res.json({
      result : true,
      msg : result.message,
      data : result.data[0]
    })
  } catch (error) {
    console.log(error)
    res.json({
      result : false,
      data : error.message
    })
  }
}
const remove = async (req ,res) =>{
  try {
    let result = await categoriesService.remove(req.params.id)
    return res.json({
      result :true,
      msg : result.message
    })
  } catch (error) {
    console.log(error)
    res.json({
      result : false,
      data : error.message
    })
  }
}

module.exports = {
  create,
  getAll,
  update,
  remove
}