const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: String,
    creationDate: Date,
    description:String,
    // deadline:String,
    member:[String],
    status:String,
    // media: {
    //     type: Buffer,
    //     required: true
    // },
    admin: String
})

module.exports = mongoose.model('Project', projectSchema);