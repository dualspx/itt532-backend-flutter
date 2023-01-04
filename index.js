const axios = require('axios')
const express =  require('express')
const app = express();
const mongoose = require('mongoose')
const uri = 'mongodb+srv://doadmin:324e9L7C5s1SDV0K@db-mongodb-sgp1-94679-01ef0c62.mongo.ondigitalocean.com/admin?tls=true&authSource=admin&replicaSet=db-mongodb-sgp1-94679'

mongoose.set('strictQuery', true) 
mongoose.connect(uri,(err) => {
    if (!err) console.log('MongoDB Connection Succeeded!')

    else console.log('Error in DB connection: ' + err)
})

app.listen(3000, () => {
    console.log('Server is listening port 3000')
})