var mongoose = require('mongoose');
var Todo = mongoose.model('Todo', {//comes back from the model, and we use it below
    text: {
        type: String,
        required: true,//will generate an error message if you don't specify the String
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt:{
        type: Number,
        default:null
    }
});
module.exports = {
    Todo: Todo
}