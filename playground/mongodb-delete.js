const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) =>{
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to the MongoDb server');

    //deleteMany
    db.collection('Users').deleteMany({name:'Albert'}).then((result) =>{
        console.log(result);
    });
    //deleteOne -> deletes the first item it suits the criterea and then it stops
    db.collection('Users').deleteOne({name: 'Vlad'}).then((result) => {
        console.log(result);
    });
    //findOneAndDelete -> returns the data it deleted
    db.collection('Users').findOneAndDelete({name: 'Vlad'}).then((result) =>{
        console.log(result);
    })
});