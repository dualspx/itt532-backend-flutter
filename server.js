const express =  require('express')
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');
var path = require('path');
const bodyParser = require('body-parser');
const uri = 'mongodb+srv://doadmin:324e9L7C5s1SDV0K@db-mongodb-sgp1-94679-01ef0c62.mongo.ondigitalocean.com/admin?tls=true&authSource=admin&replicaSet=db-mongodb-sgp1-94679'
const session = require('express-session');
const cookieParser = require('cookie-parser');
const fs = require('fs')
const jwt = require('jsonwebtoken');
var index = require('./routes/index')

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}))

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieParser());
app.set('view engine', 'ejs')
app.use('/',index)

mongoose.set('strictQuery', true) 
mongoose.connect(uri,(err) => {
    if (!err) console.log('MongoDB Connection Succeeded!')

    else console.log('Error in DB connection: ' + err)
})


app.listen(3000, () => {
    console.log('Server is listening port 3000')
})