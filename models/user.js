// var mongoose = require('mongoose')

// const userSchema = new mongoose.Schema({
//     email: String,
//     name: String,
//     pasword: String
// })

// const User = mongoose.model('User', userSchema)
// module.exports = User

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    picture: {
        type: Buffer,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
    // salt: {
    //     type: String,
    //     required: true
    // },
    // hash: {
    //     type: String,
    //     required: true
    // }
});

module.exports = mongoose.model('User', userSchema);
