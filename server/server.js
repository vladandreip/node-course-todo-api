var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

////////Configuration for basic server///////////
var app = express();//stores express application
app.listen(3000, ()=>{
    console.log('Started on port 3000');
});
/////////////////////////////////////////////////
app.use(bodyParser.json());//the return value is a function and that is the middleware we need to give to express. Now, we can send json to our application
app.post('/todos', (req,res) =>{//for creating a todo model
    //getting the body data that got sent from the client using body-parser: gets the json and convert it to a object attaching on to the request object
    console.log(req.body);//where the body gets stored by body-parser;
    var todo = new Todo({
        text: req.body.text
    });  
    todo.save().then((doc) =>{
        res.send(doc);
    }, (e) =>{
        res.status(400).send(e);
    });
});

module.exports = {
    app
};