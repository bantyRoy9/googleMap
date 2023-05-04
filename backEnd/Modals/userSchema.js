const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema =new mongoose.Schema({
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
    },
    passwordConfirm:{
        type:String,
        required:[true,'Confirm password required'],
        validate:{
            validator:function(el){
                return (el === this.password)
            },
            message:'Confirm password should be same!'
        }
    },
    photo:{
        type:String,
        default:'default.js'
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    passwordChangeAt:Date,
    passwordResetToken:String,
    passwordResetExpire:Date,
    active:{
        type:Boolean,
        default:true,
        select:false
    }
})

userSchema.pre('save', async function(next){
    console.log('dsaf')
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,12)
    console.log(this.password)
    this.passwordConfirm = undefined;
    next();
});


const userModal = mongoose.model('UserDetail', userSchema);

exports.module = userModal