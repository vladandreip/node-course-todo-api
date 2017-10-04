const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {ObjectID} = require('mongodb');

Todo.remove({}).then((result) =>{//passing and empty object, removes all records from the database
    console.log(result);//we do not get the doc back
});
//Todo.findOneAndRemove()//finds the first object and removes it. Returns the removed object
//Todo.findByIdAndRemove()//removes by id
Todo.findByIdAndRemove('59d46c0d9bf9c6650f345060').then((todo => {
    console.log(todo);
}));
Todo.findOneAndRemove({ //removes the records matching the querry
    _id:'59d46c0d9bf9c6650f345060'
}).then((todo) => {
    console.log(todo);
})