const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        trim : true,
        required : true
    },
    email : {
        type : String,
        trim : true,
        unique : true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('invalid email')
            }
        }
    },
    password : {
        type : String,
        trim : true,
        minlength : 6
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User