const {MongoClient,ObjectID} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) =>{
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to the MongoDb server')
    

    db.collection('Users').findOneAndUpdate(
    {
        _id: new ObjectID('59cba80fe6e68419f4b271aa')
    },
    {
        $set: {
            name: 'Popescu'
        }//update operator
    },
    {
        returnOriginal:false
    }).then((result) => {
        console.log(result);
    });
    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('59cba843efe6852024c69c15')

    },
    {
        $inc: {
            age: -2
        }
    },
    {
        returnOriginal: true
    }).then((result) =>{
        console.log(result);
    })

});