const fs = require("fs");
const path = require("path");
const userModels = require('../model/users')
const getAll = async (page , per_page ,sort_by , search) =>{
  let offset = (page - 1) * per_page
  let result = await userModels.getAll(per_page , offset ,sort_by ,search)
  let total  = await userModels.countUsers(search)
  return {
    message : "Get All User success",
    data : result,
    pagination : {
      total , 
      page , 
      per_page , 
      totalPage : Math.ceil(total/per_page)
    }
  }
}

const updateInfo = async (body ,id) =>{
  let result = await userModels.updateInfo(body ,id)
  if(result.affectedRows == 0){
    throw new Error("Failed to update user information");
  }
  return {
    message : "update user information success",
    data : await userModels.getUser(id)
  }

}

const uploadImage = async (image , id) =>{
  if (!image) {
    throw new Error("Image is required");
  }
  const user = await userModels.getUser(id);
  if (user[0].profile_image) {
    // example: /public/uploads/profiles/abc.png
    const oldImagePath = path.join(
      __dirname,
      "../public/uploads",
      user[0].profile_image
    );

    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }
  const filePath = `profiles/${image.filename}`
  let result = await userModels.uploadImage(filePath , id)
  if(result.affectedRows == 0) {
    throw new Error("Failed to upload profile image");
  }
  return {
    message :  "Profile image uploaded successfully",
    data  : await userModels.getUser(id)
  }
}

const deleteImage = async (id) =>{
  const user = await userModels.getUser(id);
  if (!user.length) {
    throw new Error("User not found");
  }
  if (user[0].profile_image) {

    const imagePath = path.join(
      __dirname,
      "../public/uploads",
      user[0].profile_image
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
  let result = await userModels.deleteImage(id)
  if(result.affectedRows === 0){
    throw new Error("Failed to delete profile image or user not found");
  }
  return {
    message : "Delete profile image success"
  }
}

module.exports = {
  getAll,
  updateInfo,
  uploadImage,
  deleteImage
}