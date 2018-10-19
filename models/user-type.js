const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userTypeSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Type name is required']
    }
})


const userTypeModel = mongoose.model('UserType', userTypeSchema)

module.exports = userTypeModel