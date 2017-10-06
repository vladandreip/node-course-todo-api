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
        access: {
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
//we can acces statics directly through the model 
UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;
    try{
        decoded = jwt.verify(token, 'abc123');
    } catch(e){
        return new Promise((resolve, reject) => {
            reject();// SIMPLIFY: return Promise.reject();
        })

    }
    // return User.findOne({'_id': decoded._id}).then();
    // //this.find({'_id': decoded._id}).then();
   
    return User.findOne({//user.findOne willc return a promise and we are going to return that in order to add some channing.This means we can add a then call on findByToken over in server.js
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
        
    });


}
var User = mongoose.model('User', UserSchema);
module.exports = {
    User: User
}
                                                              