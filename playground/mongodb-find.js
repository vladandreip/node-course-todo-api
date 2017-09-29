const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) =>{
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to the MongoDb server');
    db.collection('Todos').find({completed: false}).toArray().then((docs) => {//returns a cursor to mongodb. When calling toArray we convert it to an array of objects
            //INSIDE FIND WE CAN INCLUDE OUR QUERY VALUES IN AN OBJECT FORM
            //calling toAray, returns a promise
            //this is the succes case
            console.log('Todos');
            console.log(JSON.stringify(docs, undefined, 2));

        //////////////////////////////////////QUERRY BY A GIVEN OBJECT ID////////////////////////////////////////
        //the object id is not a string, it is of type object
        //db.collection('Todos').find({_id: new ObjectID('59cba1831fa58d21d86ce475')}).toArray().then((docs)
    }, (err) =>{
        console.log('Unable to fetch todos');
    });
    
    db.collection('Todos').find().count().then((count) => {//returns a cursor to mongodb. When calling toArray we convert it to an array of objects
        console.log(`Todos count: ${count}`);
}, (err) =>{
    console.log('Unable to fetch todos');
});
    db.collection('Users').find({name: 'Albert'}).toArray().then((result) => {
        console.log(JSON.stringify(result, undefined,2));
    }, (err) => {
        console.log('Unable to fetch data');
    });

});