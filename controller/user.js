const userService = require('../service/users')
const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const per_page = parseInt(req.query.per_page) || 10;
    let sort_by = req.query.sort_by || "DESC";
    sort_by = sort_by.toUpperCase();
    if (sort_by !== "ASC" && sort_by !== "DESC") {
      sort_by = "DESC";
    }
    const search = req.query.search || "";
    let result = await userService.getAll(page ,per_page ,sort_by , search)
    return res.json({
      result : true ,
      msg : result.message,
      data : result.data,
      pagination : result.pagination
    })

  } catch (error) {
    console.log(error);
    res.json({
      result: false,
      msg: error.message
    })
  }
}

const updateInfo = async (req, res) =>{
  try {
    let result = await userService.updateInfo(req.body , req.params.id)
    return res.json({
      result : true ,
      msg : result.message ,
      data : result.data[0]
    })
  } catch (error) {
    console.log(error);
    res.json({
      result: false,
      msg: error.message
    })
  }
}

const uploadImage = async (req ,res) =>{
  try {
    let result = await userService.uploadImage(req.file , req.user.id)
    return res.json({
      result : true , 
      msg : result.message ,
      data : result.data[0]
    })
  } catch (error) {
    console.log(error);
    res.json({
      result: false,
      msg: error.message
    })
  }
}

const deleteImage = async (req , res) =>{
  try {
    let result = await userService.deleteImage(req.user.id)
    return res.json({
      result : true ,
      msg : result.message
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
  getAll,
  updateInfo,
  uploadImage,
  deleteImage
}