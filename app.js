const express = require('express')
const auth = require('./routes/auth')
const app = express()

require('dotenv').config();

app.use(express.json())
app.use('/api/auth',auth);

app.listen(3000, () => {
    console.log("server is running on port 3000");
    
})