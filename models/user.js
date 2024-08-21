const { Schema, model } = require('mongoose')
const {createHmac , randomBytes} = require('node:crypto')
const { createTokenForUser } = require('../services/authentication')

const UserSchema = new Schema({
    fullName : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    salt : {
        type : String,
    },
    password : {
        type : String,
        required : true,
    },
    profileImageUrl : {
        type : String,
        default : '/image/default.jpg',
    },
    role: {  
        type : String,
        enum : ['user', 'admin'],
        default : 'user'
    }
},{timestamps : true})

UserSchema.pre("save" , function (next) {
    const user = this;
    if(!user.isModified('password')) return;
    
    const salt = randomBytes(16).toString()
    const hashedPassword = createHmac('sha256', salt)
    .update(user.password)
    .digest('hex')

    this.salt = salt
    this.password = hashedPassword

    next()
})

UserSchema.static('matchPassword' , async function (email, password) {
    const user = await this.findOne({email})
    if (!user) throw new Error("User Not Found");

    const salt = user.salt
    const hashedPassword = user.password

    const userProvidedHashed = createHmac('sha256', salt)
    .update(password)
    .digest('hex')

    if(hashedPassword !== userProvidedHashed){
        throw new Error("Invalid Password");
    }

    const token = createTokenForUser(user)
    return token
})


const User = model('user' , UserSchema);

module.exports = User;