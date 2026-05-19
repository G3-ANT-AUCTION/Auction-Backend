const express = require('express')
const categories = require('../controller/category')
const validate = require('../middlewares/validate')
const fieldSchema = require('../validators/category')
const route = express.Router()

route.post('/category' ,validate(fieldSchema),categories.create)
route.get('/category' , categories.getAll)
route.put('/category/:id',validate(fieldSchema), categories.update)
route.delete('/category/:id' ,categories.remove)

module.exports = route