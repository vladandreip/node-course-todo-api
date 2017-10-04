const _ = require('lodash'); // installed for the update route
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectId} = require('mongodb');

////////Configuration for basic server///////////
var app = express();//stores express application
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Started on port ${port}`);
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
// Get /todos/123123. Fetching an Url parameter follows this pattern, where the todosId is 123123 -> it could be called anyway.
app.get('/todos/:id', (req, res) => {
    var id = req.params.id; //to acces the id you need to use req.params.id
    if(!ObjectId.isValid(id)){
        res.status(404).send();
    }
    Todo.findById(id).then((todo) =>{
        if(!todo){
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
   
});
app.post('/users', (req,res) =>{
    var user = new User({
        email: req.body.email
    });
    user.save().then((doc) => {
        console.log(doc);
    }, (e) =>{
        console.log('Could not save user.', e);
    })
});
app.get('/todos', (req,res) =>{
    Todo.find().then((todos) => {
        res.send({//we create an object with first propriety being the todos array. By doing this we are able to send more codes, specifing them in the object
            todos,//todos:todos
            cod: 'Un cod'
        })
    }, (e) => {
        res.status(400).send(e);
    });
})
app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectId.isValid(id)){
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo){//if we do not have any record, the deletion will return null. We need the if statement
             return res.status(404).send();
        }
            res.status(200).send({todo});
        
    }).catch((e) =>{
        res.status(400).send(e);
    })
    
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    //text si completed sunt trimise din postman 
    var body = _.pick(req.body, ['text', 'completed'])//Reason why we loaded in loadash. The updates will be stored in the updates body. With pick we pull of the proprietis we allow the users to update
    //the array consists of proprieties you want to pull off if they exist. For example: if the text propriety exists, we want to pull that of the req.body adding it to body(left)
    if(!ObjectId.isValid(id)){
        return res.status(404).send();
    }

    if( _.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime(); 
    }else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id, {
        $set: body//seteaza la ce vrem sa facem update
    }, {
        new: true//simillar to  returnOriginal:false which means we want to get back the original updated record
    }).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    })
});

module.exports = {
    app
};