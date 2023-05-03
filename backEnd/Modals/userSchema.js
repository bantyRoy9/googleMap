const moongoose = require('mongoose');
const validator = require('validator')

const userSchema =new moongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:[true,'email is required'],
        validator:[validator.isEmail,'Please provide valide email id']
    },
    password:{
        type:String,
        required:true,
        minLength:4
    }
})

const userModal = mongoose.model('UserDetail', userSchema);

exports.module = userModal