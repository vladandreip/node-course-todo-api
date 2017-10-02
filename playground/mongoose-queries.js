const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {ObjectID} = require('mongodb');

var id = '59d1cb84989e85a42fe093fd';

Todo.find({
    _id: id//Mangoose will take the string Id, will convert it into an object id and then will querry. Doesn't require to pass object ids
}).then((todos) => {
    console.log('Todos', todos);
});

Todo.findOne({//returns one document at most(first one that matches the querry).
    _id:id
}).then((todo) => {
    console.log('Todo', todo);
});
Todo.findById(id).then((todo) => {// just sending the id
    if(!todo){
        return console.log('Id not found');
    }
    console.log('Todo by id', todo);
}).catch((e) => {
    return console.log(e);
});
var  userId = '59d1d90b7ec2590405c19696';
User.findById(userId).then((user) => {
    if(!ObjectID.isValid(id)){
        return console.log('ID not valid');
    }
    if(!user){
        return console.log('User not found');
    }
    console.log('User by id', user);
}).catch((e) => {
    return console.log(e);
});