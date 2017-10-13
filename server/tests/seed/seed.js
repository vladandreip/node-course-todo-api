const {ObjectId} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken')
const userOneId = new ObjectId();
const userTwoId = new ObjectId();
const users = [{
    _id : userOneId,
    email: 'vlad@example.com',
    password: 'userPassOne',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
},{
    _id : userTwoId,
    email: 'popescu@example.com',
    password: 'userPassTwo',
}];
const todos = [{//2 dummy data
    _id: new ObjectId(),
    text: 'First test todo'
}, {
    _id: new ObjectId(),
    text: 'Second test todo',
    completed: true,
    completedAt: 123
}];
const populateTodos = (done) => { //executes before test cases 
    Todo.remove({})//wipes all the database
    .then(() => {
        //done();
        return Todo.insertMany(todos);
        //done();
    }).then(() => done());
};
const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]).then(() => {//takes an array of promises. This callback will not be called untill all promises are resolved. That means useOne and userTwo were successfully saved to the database
        }).then(() => done());
    });
};
module.exports = {todos, populateTodos, users, populateUsers};