//mongoose ofers a much easier usage of data validation. We could've done that without using mangoose, but be doing so we get some fantastic features
var mongoose = require('mongoose');

//need to connect to the db. Mongoose suports callbacks
mongoose.Promise = global.Promise;//tells mangoose to use the buit-in promise library as supossed to a third-party buit in promise
mongoose.connect('mongodb://localhost:27017/TodoApp');//mentains the connection over time
module.exports = {
    mongoose: mongoose
}