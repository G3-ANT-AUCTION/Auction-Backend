const express = require('express')
const auth = require('./routes/auth')
const users = require('./routes/users')
const categories = require('./routes/category')
const app = express()

require('dotenv').config();

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use("/uploads",express.static(path.join(__dirname, "public/uploads")));
app.use('/api/auth',auth);
app.use('/api/users' , users)
app.use('/api' , categories)

app.listen(3000, () => {
    console.log("server is running on port 3000");
    
})