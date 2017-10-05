//daca nu gaseste process.env.NODE_ENV, il seteaza ca 'development'. Cand incep rutina de test, il am deja setat din scriptul test :)
var env = process.env.NODE_ENV || 'development';//this is only set on heroku. We do not have this enviroment variable set locally
//If we are in developing mode we want to use a specific database. When we are testing we want to use another database and we want to use the app for production we want to use a third different database from the 2 specifiend previously
//we need to add some export blocks to package.json for this to occur
//"test": "export NODE_ENV=test || SET \"NODE_ENV=test\" mocha server/**/*.test.js" din package.json 
console.log('*******',env);
if( env === 'development'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
}else if(env === 'test'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}