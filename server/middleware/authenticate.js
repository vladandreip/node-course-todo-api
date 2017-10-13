var {User} = require('./../models/user')
var authenticate = (req, res, next) => {//written this way for reusability
    var token = req.header('x-auth'); //gets the value for the x-auth 
    User.findByToken(token).then((user) => {
        if(!user){
            res.status(401).send();//better: return Promise.reject();     -> the code after it will not be executed
        }
    
        req.user = user;//we can modify the request data and use it down bellow
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send();// 401 -> authentification required
        //we are not calling next() because we do not want to execute the code down bellow if the user didn't authenticate
    });
}
module.exports = {authenticate};