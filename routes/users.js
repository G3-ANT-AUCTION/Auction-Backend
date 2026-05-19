
const express = require('express')
const userController =require ('../controller/user')
const validate = require('../middlewares/validate')
const {updateProfileSchema} =require('../validators/user')
const authMiddleware = require('../middlewares/auth')
const upload = require('../middlewares/uploads')

const route = express.Router()

route.get('/getAll' , authMiddleware.login,userController.getAll)
route.put('/info/:id' ,authMiddleware.login,validate(updateProfileSchema),userController.updateInfo)
route.post('/image' ,authMiddleware.login ,upload('profiles').single('profile_image'),userController.uploadImage)
route.delete('/image' , authMiddleware.login , userController.deleteImage)

module.exports = route