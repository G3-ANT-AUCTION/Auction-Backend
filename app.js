const express = require('express')
const auth = require('./routes/auth')

const app = express()

app.use(express.json())
app.use('/api/auth',auth);
require('dotenv').config();

app.listen(3000, () => {
    console.log("server is running on port 3000");
    
})