const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

const Schema = mongoose.Schema

const userSchema = new Schema({
    first_name: {
        type: String,
        required: [true, 'first name is required']
    },
    last_name: {
        type: String,
        required: [true, 'last name is required']
    },
    email: {
        type: String,
        required: [true, 'email is required']
    },
    phone_no: {
        type: String,
        required: [true, 'phone number is required']
    },
    gender: {
        type: Number,
        required: [true, 'gender is required']
    },
    logged_in: {
        type: Boolean,
        default: false
    },
    user_type_id: {
        type: mongoose.Schema.Types.ObjectId,
        rel: "UserType"
    },
    password: {
        type: String,
        required: [true, 'password is required']
    }
})

userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null)
}

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

const userModel = mongoose.model('user', userSchema)

module.exports = userModel