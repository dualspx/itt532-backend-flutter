var mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    description: String
})

