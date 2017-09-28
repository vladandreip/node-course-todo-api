const MongoClient = require('mongodb').MongoClient;//mongo client lets you connect to a mongo server. Issue comands to communicate with the database
//const {MongoClient} = require('mongodb'); //identical to what is up above
//const {MongoClient, ObjectID} = require('mongodb'); // ObjectID = require('mongodb').ObjectID;
//Destructoring
var user = {name:'Vlad',
            age:22}
var {name,age} = user;//grabs name and creates a new 'vlad' variable. Identical to 'var Vlad = user.name' 
console.log(name);



MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{//first parameter will be the URL where your database lives(it could be a heroku url).(in our case it will be our local url where the database lives)
    //err will exist if an error actually happens.
    //db will be the database object used for crud operations 
    //mongodb will create the database only after you start writing in the database. You can connect to the database even tho it wasnt created yet
    if(err){
        return console.log('Unable to connect to MongoDb server');//return for preventing the rest of the function executing
    }
    console.log('Connected to MongoDb server');

    db.collection('Todos').insertOne({//takes the string name of the collection(table) and insert a new document
        text: 'Something to do2',
        completed: false
    }, (err, result) => {//calback function called either when things went well or wrong 
        if(err){
            return console.log('Unable to insert todo', err);
        }
        console.log(JSON.stringify(result.ops,undefined, 2));//result.ops stores all of the docs we have inserted + identation
    });
    db.collection('Users').insert({
        name: 'Vlad',
        age:22,
        location:'Regie'
    }, (err, result)=>{
        if(err){
            return console.log('Unable to insert todo', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
        console.log(result.ops[0]._id.getTimestamp());//we insert just one element so its position 0
    });

    db.close();//closes connection with the db server
});
//we will use the 'mongodb://' protocol. Creates a new TodoApp if it wasnt previously created
//the second parameter will be a callback function that will be fired either if the connection succeded or failed
