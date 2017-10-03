//mongoose ofers a much easier usage of data validation. We could've done that without using mangoose, but be doing so we get some fantastic features
var mongoose = require('mongoose');

//need to connect to the db. Mongoose suports callbacks
mongoose.Promise = global.Promise;//tells mangoose to use the buit-in promise library as supossed to a third-party buit in promise
//mongoose.connect('mongodb://localhost:27017/TodoApp');//mentains the connection over time
mongoose.connect('mongodb://<lambadda1>:<v1l2a3d4>@ds163034.mlab.com:63034/todos');
module.exports = {
    mongoose: mongoose
}