const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
var UserSchema = new mongoose.Schema({//we create a schema to get acces to the custom methods of mongoose like findUserBy
    email: {
        required:true,
        trim:true,
        type:String,
        minlength:1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: `{VALUE} is not a valid email`
        }
    },
    password: {
        type: String,
        require: true,
        minlength:6
    },
    //going to be how we acces the tokens for individual users s
    tokens: [{
        acces: {
            type: String,
            require: true
        },
        token: {
            type: String,
            require: true
        }
    }]
})
UserSchema.methods.toJson = function () {//this method determines what exatly gets sent back, when a mangoose value is converted to a JSON value
    user = this;
    var userObject = user.toObject();//this is responsible for taking user and convert it to a regular object where only the proprieties available onthe document exist. Converts to a json 
    return _.pick(userObject, ['_id', 'email'])
} 
UserSchema.methods.generateAuthToken = function() {//created method
    var user = this;//the this keyword stores the individual document 
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
    user.tokens.push({access, token});
    return user.save().then(() => {
        return token;
    });//.then((token) => {

    
    
    
};
var User = mongoose.model('User', UserSchema);
module.exports = {
    User: User
}